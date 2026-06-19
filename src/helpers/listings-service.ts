import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "../database";
import { listings } from "../database/schemas/listings";
import { users } from "../database/schemas/users";
import { formatListingDate, formatPrice } from "./format-price";

export type ListingCardData = {
  id: string;
  title: string;
  brand: string;
  city: string;
  motorType: string;
  conditionType: string;
  damageState: string;
  timingType: string;
  transmission: string;
  color: string;
  origin: string;
  year: number;
  engineCc: number;
  priceValue: number;
  price: string;
  imageUrl: string;
  featured: boolean;
  status: string;
  createdAt: string;
};

export type ListingDetailData = ListingCardData & {
  district: string;
  km: number;
  fuelType: string;
  gear: string;
  condition: string;
  adDate: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    memberSince: string;
    responseRate: string;
    phone: string;
  };
};

export type CreateListingPayload = {
  title: string;
  brand: string;
  model?: string;
  city: string;
  district?: string;
  motorType: string;
  conditionType: string;
  damageState: string;
  timingType: string;
  transmission: string;
  fuelType?: string;
  color: string;
  origin: string;
  year: number;
  km?: number;
  engineCc: number;
  priceValue: number;
  description?: string;
  images: string[];
  status?: "draft" | "pending" | "published";
  featured?: boolean;
};

function getDatabase() {
  return db.getConnection("default");
}

function mapListingCard(row: typeof listings.$inferSelect): ListingCardData {
  return {
    id: row.id,
    title: row.title,
    brand: row.brand,
    city: row.city,
    motorType: row.motorType,
    conditionType: row.conditionType,
    damageState: row.damageState,
    timingType: row.timingType,
    transmission: row.transmission,
    color: row.color,
    origin: row.origin,
    year: row.year,
    engineCc: row.engineCc,
    priceValue: row.priceValue,
    price: formatPrice(row.priceValue),
    imageUrl: row.images[0] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
    featured: row.featured,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listPublishedListings(options?: {
  featured?: boolean;
  limit?: number;
}): Promise<ListingCardData[]> {
  const database = getDatabase();
  const conditions = [eq(listings.status, "published")];

  if (options?.featured) {
    conditions.push(eq(listings.featured, true));
  }

  let query = database
    .select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(desc(listings.createdAt));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  const rows = await query;
  return rows.map(mapListingCard);
}

export async function countPublishedListings(): Promise<number> {
  const database = getDatabase();
  const result = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .where(eq(listings.status, "published"));

  return result[0]?.count ?? 0;
}

export async function getListingDetail(id: string): Promise<ListingDetailData | null> {
  const database = getDatabase();

  const rows = await database
    .select({
      listing: listings,
      seller: users,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .where(eq(listings.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return null;
  }

  if (row.listing.status !== "published") {
    return null;
  }

  await database
    .update(listings)
    .set({ views: row.listing.views + 1 })
    .where(eq(listings.id, id));

  const card = mapListingCard(row.listing);

  return {
    ...card,
    district: row.listing.district || "",
    km: row.listing.km || 0,
    fuelType: row.listing.fuelType || "Benzin",
    gear: row.listing.transmission,
    condition: row.listing.damageState,
    adDate: formatListingDate(row.listing.createdAt),
    description: row.listing.description || "",
    images: row.listing.images,
    seller: {
      name: row.seller.fullName,
      memberSince: String(row.seller.createdAt.getFullYear()),
      responseRate: "%95",
      phone: row.seller.phone || "Telefon bilgisi yok",
    },
  };
}

export async function listSimilarListings(
  listingId: string,
  brand: string,
  limit = 4
): Promise<ListingCardData[]> {
  const database = getDatabase();
  const rows = await database
    .select()
    .from(listings)
    .where(
      and(
        eq(listings.status, "published"),
        eq(listings.brand, brand),
        ne(listings.id, listingId)
      )
    )
    .orderBy(desc(listings.createdAt))
    .limit(limit);

  return rows.map(mapListingCard);
}

export async function listUserListings(userId: string): Promise<ListingCardData[]> {
  const database = getDatabase();
  const rows = await database
    .select()
    .from(listings)
    .where(eq(listings.userId, userId))
    .orderBy(desc(listings.createdAt));

  return rows.map(mapListingCard);
}

export async function createListing(
  userId: string,
  payload: CreateListingPayload
): Promise<ListingCardData> {
  const database = getDatabase();
  const id = `listing_${crypto.randomUUID()}`;
  const now = new Date();

  const [row] = await database
    .insert(listings)
    .values({
      id,
      userId,
      title: payload.title.trim(),
      brand: payload.brand.trim(),
      model: payload.model?.trim() || null,
      city: payload.city.trim(),
      district: payload.district?.trim() || null,
      motorType: payload.motorType,
      conditionType: payload.conditionType,
      damageState: payload.damageState,
      timingType: payload.timingType,
      transmission: payload.transmission,
      fuelType: payload.fuelType || null,
      color: payload.color,
      origin: payload.origin,
      year: payload.year,
      km: payload.km ?? null,
      engineCc: payload.engineCc,
      priceValue: payload.priceValue,
      description: payload.description?.trim() || null,
      images: payload.images,
      status: payload.status || "published",
      featured: payload.featured ?? false,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return mapListingCard(row);
}

export function getDashboardStatusLabel(status: string): "Yayında" | "İncelemede" | "Satıldı" | "Taslak" {
  switch (status) {
    case "published":
      return "Yayında";
    case "pending":
      return "İncelemede";
    case "sold":
      return "Satıldı";
    default:
      return "Taslak";
  }
}
