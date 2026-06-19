import { eq, ilike, or } from "drizzle-orm";
import { loadEnvFile } from "../src/config/load-env";
import { initializeDatabases, closeDatabases } from "../src/config/database";
import { db } from "../src/database";
import { users } from "../src/database/schemas/users";

loadEnvFile();

const identifier = process.argv[2];
const newPassword = process.argv[3];

if (!identifier || !newPassword) {
  console.error("Kullanım: bun scripts/set-password.ts <email-veya-kullanici-adi> <yeni-sifre>");
  process.exit(1);
}

await initializeDatabases();
const database = db.getConnection("default");

const normalized = identifier.trim().toLocaleLowerCase("tr-TR");
const rows = await database
  .select()
  .from(users)
  .where(
    or(
      ilike(users.email, normalized),
      ilike(users.username, normalized)
    )
  )
  .limit(1);

const user = rows[0];

if (!user) {
  console.error("Kullanıcı bulunamadı:", identifier);
  process.exit(1);
}

const passwordHash = await Bun.password.hash(newPassword);

await database
  .update(users)
  .set({ passwordHash })
  .where(eq(users.id, user.id));

console.log(`Şifre güncellendi: ${user.username} (${user.email})`);
await closeDatabases();
