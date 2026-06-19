import { and, eq, ilike, ne, or } from "drizzle-orm";
import { db } from "../database";
import { users } from "../database/schemas/users";

export type SellerType = "bireysel" | "kurumsal";

export type StoredUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  sellerType: SellerType;
  passwordHash?: string;
  provider?: "local" | "google";
  avatarUrl?: string;
  createdAt: number;
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

type RegisterPayload = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  sellerType: SellerType;
};

function getDatabase() {
  return db.getConnection("default");
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

function toPublicUser(user: StoredUser): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

function mapUserRow(row: typeof users.$inferSelect): StoredUser {
  return {
    id: row.id,
    fullName: row.fullName,
    username: row.username,
    email: row.email,
    phone: row.phone || undefined,
    sellerType: row.sellerType as SellerType,
    passwordHash: row.passwordHash || undefined,
    provider: (row.provider as "local" | "google") || "local",
    avatarUrl: row.avatarUrl || undefined,
    createdAt: row.createdAt.getTime(),
  };
}

export async function registerUser(payload: RegisterPayload): Promise<PublicUser> {
  const database = getDatabase();
  const normalizedEmail = normalize(payload.email);
  const normalizedUsername = normalize(payload.username);

  const existing = await database
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      or(
        ilike(users.email, normalizedEmail),
        ilike(users.username, normalizedUsername)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    if (normalize(existing[0].email) === normalizedEmail) {
      throw new Error("Bu e-posta adresi zaten kayıtlı.");
    }

    throw new Error("Bu kullanıcı adı zaten kullanılıyor.");
  }

  const passwordHash = await Bun.password.hash(payload.password);
  const id = `user_${crypto.randomUUID()}`;

  const [row] = await database
    .insert(users)
    .values({
      id,
      fullName: payload.fullName.trim(),
      username: payload.username.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      sellerType: payload.sellerType,
      provider: "local",
      passwordHash,
    })
    .returning();

  return toPublicUser(mapUserRow(row));
}

export async function authenticateUser(identifier: string, password: string): Promise<PublicUser | null> {
  const database = getDatabase();
  const normalizedIdentifier = normalize(identifier);

  const rows = await database
    .select()
    .from(users)
    .where(
      or(
        ilike(users.email, normalizedIdentifier),
        ilike(users.username, normalizedIdentifier)
      )
    )
    .limit(1);

  const row = rows[0];
  if (!row?.passwordHash) {
    return null;
  }

  const valid = await Bun.password.verify(password, row.passwordHash);
  return valid ? toPublicUser(mapUserRow(row)) : null;
}

export async function findOrCreateGoogleUser(payload: {
  email: string;
  fullName: string;
  avatarUrl?: string;
}) {
  const database = getDatabase();
  const normalizedEmail = normalize(payload.email);

  const existingRows = await database
    .select()
    .from(users)
    .where(ilike(users.email, normalizedEmail))
    .limit(1);

  if (existingRows[0]) {
    return toPublicUser(mapUserRow(existingRows[0]));
  }

  const baseUsername = normalize(payload.fullName || payload.email.split("@")[0]).replace(/\s+/g, "_");
  let usernameCandidate = baseUsername || `google_${Date.now()}`;
  let counter = 1;

  while (true) {
    const taken = await database
      .select({ id: users.id })
      .from(users)
      .where(ilike(users.username, usernameCandidate))
      .limit(1);

    if (taken.length === 0) {
      break;
    }

    usernameCandidate = `${baseUsername}_${counter}`;
    counter += 1;
  }

  const [row] = await database
    .insert(users)
    .values({
      id: `user_${crypto.randomUUID()}`,
      fullName: payload.fullName.trim(),
      username: usernameCandidate,
      email: payload.email.trim(),
      sellerType: "bireysel",
      provider: "google",
      avatarUrl: payload.avatarUrl || null,
    })
    .returning();

  return toPublicUser(mapUserRow(row));
}

export async function getUserById(userId: string): Promise<PublicUser | null> {
  const database = getDatabase();
  const rows = await database.select().from(users).where(eq(users.id, userId)).limit(1);
  const row = rows[0];
  return row ? toPublicUser(mapUserRow(row)) : null;
}

async function getStoredUserById(userId: string): Promise<StoredUser | null> {
  const database = getDatabase();
  const rows = await database.select().from(users).where(eq(users.id, userId)).limit(1);
  const row = rows[0];
  return row ? mapUserRow(row) : null;
}

export type UpdateProfilePayload = {
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  sellerType?: SellerType;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function updateUserProfile(
  userId: string,
  payload: UpdateProfilePayload
): Promise<PublicUser> {
  const database = getDatabase();
  const current = await getStoredUserById(userId);

  if (!current) {
    throw new Error("Kullanıcı bulunamadı.");
  }

  const nextFullName = payload.fullName !== undefined ? payload.fullName.trim() : current.fullName;
  const nextUsername = payload.username !== undefined ? payload.username.trim() : current.username;
  const nextEmail = payload.email !== undefined ? payload.email.trim() : current.email;
  const nextPhone = payload.phone !== undefined ? payload.phone.trim() : current.phone || "";
  const nextSellerType = payload.sellerType ?? current.sellerType;

  if (nextFullName.length < 2) {
    throw new Error("Ad soyad en az 2 karakter olmalıdır.");
  }

  if (nextUsername.length < 3) {
    throw new Error("Kullanıcı adı en az 3 karakter olmalıdır.");
  }

  if (!isValidEmail(nextEmail)) {
    throw new Error("Geçerli bir e-posta adresi gir.");
  }

  if (nextSellerType !== "bireysel" && nextSellerType !== "kurumsal") {
    throw new Error("Satıcı tipi geçersiz.");
  }

  const normalizedEmail = normalize(nextEmail);
  const normalizedUsername = normalize(nextUsername);

  const conflicts = await database
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      and(
        ne(users.id, userId),
        or(ilike(users.email, normalizedEmail), ilike(users.username, normalizedUsername))
      )
    )
    .limit(1);

  if (conflicts.length > 0) {
    if (normalize(conflicts[0].email) === normalizedEmail) {
      throw new Error("Bu e-posta adresi başka bir hesapta kayıtlı.");
    }

    throw new Error("Bu kullanıcı adı zaten kullanılıyor.");
  }

  const [row] = await database
    .update(users)
    .set({
      fullName: nextFullName,
      username: nextUsername,
      email: nextEmail,
      phone: nextPhone || null,
      sellerType: nextSellerType,
    })
    .where(eq(users.id, userId))
    .returning();

  return toPublicUser(mapUserRow(row));
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const database = getDatabase();
  const current = await getStoredUserById(userId);

  if (!current) {
    throw new Error("Kullanıcı bulunamadı.");
  }

  if (!current.passwordHash) {
    throw new Error("Google ile giriş yaptığın için şifre değiştirme bu hesapta kullanılamaz.");
  }

  const valid = await Bun.password.verify(currentPassword, current.passwordHash);
  if (!valid) {
    throw new Error("Mevcut şifre hatalı.");
  }

  if (newPassword.length < 6) {
    throw new Error("Yeni şifre en az 6 karakter olmalıdır.");
  }

  const passwordHash = await Bun.password.hash(newPassword);

  await database.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
