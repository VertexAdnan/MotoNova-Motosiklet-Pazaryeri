import { and, desc, eq } from "drizzle-orm";
import { db } from "../database";
import { catalogModelRequests, catalogModels } from "../database/schemas/catalog";
import {
  brandsTR,
  modelsByBrandIdTR,
  type CatalogBrand,
  type CatalogModel,
} from "../utils/motorcycle-catalog";

export type CatalogModelView = CatalogModel & {
  yearFrom?: number | null;
  yearTo?: number | null;
  source?: string;
};

export type ModelRequestView = {
  id: string;
  userId: string;
  brandName: string;
  modelName: string;
  yearFrom?: number | null;
  yearTo?: number | null;
  notes?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
};

function getDatabase() {
  return db.getConnection("default");
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function findStaticBrand(brandName: string): CatalogBrand | undefined {
  const normalized = normalizeName(brandName).toLocaleLowerCase("tr-TR");
  return brandsTR.find((brand) => brand.name.toLocaleLowerCase("tr-TR") === normalized);
}

export function isAdminUser(email?: string | null) {
  if (!email) {
    return false;
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLocaleLowerCase("tr-TR"))
    .filter(Boolean);

  return adminEmails.includes(email.toLocaleLowerCase("tr-TR"));
}

export async function listCatalogBrands(): Promise<CatalogBrand[]> {
  const database = getDatabase();
  const dbBrandRows = await database
    .select({ brandName: catalogModels.brandName })
    .from(catalogModels)
    .where(eq(catalogModels.isActive, true));

  const brandMap = new Map<string, CatalogBrand>();

  for (const brand of brandsTR) {
    brandMap.set(brand.name.toLocaleLowerCase("tr-TR"), brand);
  }

  for (const row of dbBrandRows) {
    const name = normalizeName(row.brandName);
    const key = name.toLocaleLowerCase("tr-TR");

    if (!brandMap.has(key)) {
      brandMap.set(key, {
        id: `brand_${slugify(name)}`,
        slug: slugify(name),
        name,
        isActive: true,
      });
    }
  }

  return Array.from(brandMap.values()).sort((left, right) =>
    left.name.localeCompare(right.name, "tr-TR")
  );
}

export async function listCatalogModels(brandId: string): Promise<CatalogModelView[]> {
  const staticBrand = brandsTR.find((brand) => brand.id === brandId);
  if (!staticBrand) {
    const database = getDatabase();
    const brandSlug = brandId.replace(/^brand_/, "");
    const dbRows = await database
      .select()
      .from(catalogModels)
      .where(and(eq(catalogModels.isActive, true)));

    return dbRows
      .filter((row) => slugify(row.brandName) === brandSlug)
      .map((row) => ({
        id: `model_db_${row.id}`,
        brandId,
        slug: slugify(row.modelName),
        name: row.modelName,
        isActive: true,
        yearFrom: row.yearFrom,
        yearTo: row.yearTo,
        source: row.source,
      }))
      .sort((left, right) => left.name.localeCompare(right.name, "tr-TR"));
  }

  const staticModels = (modelsByBrandIdTR[brandId] ?? []).map((model) => ({
    ...model,
    source: "static",
  }));

  const database = getDatabase();
  const dbRows = await database
    .select()
    .from(catalogModels)
    .where(and(eq(catalogModels.isActive, true), eq(catalogModels.brandName, staticBrand.name)));

  const merged = new Map<string, CatalogModelView>();

  for (const model of staticModels) {
    merged.set(model.name.toLocaleLowerCase("tr-TR"), model);
  }

  for (const row of dbRows) {
    const key = row.modelName.toLocaleLowerCase("tr-TR");
    if (!merged.has(key)) {
      merged.set(key, {
        id: `model_db_${row.id}`,
        brandId,
        slug: slugify(row.modelName),
        name: row.modelName,
        isActive: true,
        yearFrom: row.yearFrom,
        yearTo: row.yearTo,
        source: row.source,
      });
    }
  }

  return Array.from(merged.values()).sort((left, right) =>
    left.name.localeCompare(right.name, "tr-TR")
  );
}

export async function createModelRequest(payload: {
  userId: string;
  brandName: string;
  modelName: string;
  yearFrom?: number;
  yearTo?: number;
  notes?: string;
}) {
  const database = getDatabase();
  const brandName = normalizeName(payload.brandName);
  const modelName = normalizeName(payload.modelName);

  if (!brandName || !modelName) {
    throw new Error("Marka ve model adı zorunludur.");
  }

  const [row] = await database
    .insert(catalogModelRequests)
    .values({
      id: `req_${crypto.randomUUID()}`,
      userId: payload.userId,
      brandName,
      modelName,
      yearFrom: payload.yearFrom ?? null,
      yearTo: payload.yearTo ?? null,
      notes: payload.notes?.trim() || null,
      status: "pending",
    })
    .returning();

  return mapRequestRow(row);
}

export async function listModelRequests(status?: string): Promise<ModelRequestView[]> {
  const database = getDatabase();

  const rows = status
    ? await database
        .select()
        .from(catalogModelRequests)
        .where(eq(catalogModelRequests.status, status))
        .orderBy(desc(catalogModelRequests.createdAt))
    : await database
        .select()
        .from(catalogModelRequests)
        .orderBy(desc(catalogModelRequests.createdAt));

  return rows.map(mapRequestRow);
}

export async function reviewModelRequest(payload: {
  requestId: string;
  reviewerUserId: string;
  action: "approve" | "reject";
  adminNotes?: string;
}) {
  const database = getDatabase();
  const rows = await database
    .select()
    .from(catalogModelRequests)
    .where(eq(catalogModelRequests.id, payload.requestId))
    .limit(1);

  const request = rows[0];
  if (!request) {
    throw new Error("Başvuru bulunamadı.");
  }

  if (request.status !== "pending") {
    throw new Error("Bu başvuru zaten değerlendirilmiş.");
  }

  const now = new Date();
  const nextStatus = payload.action === "approve" ? "approved" : "rejected";

  await database
    .update(catalogModelRequests)
    .set({
      status: nextStatus,
      adminNotes: payload.adminNotes?.trim() || null,
      reviewedBy: payload.reviewerUserId,
      reviewedAt: now,
    })
    .where(eq(catalogModelRequests.id, payload.requestId));

  if (payload.action === "approve") {
    const staticBrand = findStaticBrand(request.brandName);
    const brandName = staticBrand?.name ?? request.brandName;

    const existing = await database
      .select({ id: catalogModels.id })
      .from(catalogModels)
      .where(
        and(
          eq(catalogModels.brandName, brandName),
          eq(catalogModels.modelName, request.modelName)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      await database.insert(catalogModels).values({
        id: `cat_${crypto.randomUUID()}`,
        brandName,
        modelName: request.modelName,
        yearFrom: request.yearFrom,
        yearTo: request.yearTo,
        source: "request",
        requestId: request.id,
        isActive: true,
        createdAt: now,
      });
    }
  }

  const updatedRows = await database
    .select()
    .from(catalogModelRequests)
    .where(eq(catalogModelRequests.id, payload.requestId))
    .limit(1);

  return mapRequestRow(updatedRows[0]);
}

function mapRequestRow(row: typeof catalogModelRequests.$inferSelect): ModelRequestView {
  return {
    id: row.id,
    userId: row.userId,
    brandName: row.brandName,
    modelName: row.modelName,
    yearFrom: row.yearFrom,
    yearTo: row.yearTo,
    notes: row.notes,
    status: row.status,
    adminNotes: row.adminNotes,
    createdAt: row.createdAt.toISOString(),
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
  };
}
