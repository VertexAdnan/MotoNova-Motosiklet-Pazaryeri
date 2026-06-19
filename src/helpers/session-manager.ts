import { eq, lt } from "drizzle-orm";
import { db } from "../database";
import { sessions } from "../database/schemas/sessions";

function getDatabase() {
  try {
    return db.getConnection("default");
  } catch {
    return null;
  }
}

export class SessionManager {
  private readonly store = new Map<string, AppSession>();
  private readonly cleanupTimer: Timer;
  private readonly options: Required<AppSessionOptions>;

  constructor(options?: AppSessionOptions) {
    this.options = {
      maxAge: options?.maxAge || 24 * 60 * 60 * 1000,
      cookieName: options?.cookieName || "session_id",
      httpOnly: options?.httpOnly ?? true,
      secure: options?.secure ?? process.env.NODE_ENV === "production",
      sameSite: options?.sameSite || "Lax",
    };

    this.cleanupTimer = setInterval(() => {
      void this.cleanup();
    }, 5 * 60 * 1000);
  }

  async create(data: Record<string, unknown> = {}): Promise<AppSession> {
    const id = this.generateSessionId();
    const now = Date.now();
    const session: AppSession = {
      id,
      data,
      createdAt: now,
      expiresAt: now + this.options.maxAge,
    };

    this.store.set(id, session);

    const database = getDatabase();
    if (database) {
      await database.insert(sessions).values({
        id: session.id,
        data: session.data,
        createdAt: new Date(session.createdAt),
        expiresAt: new Date(session.expiresAt),
      });
    }

    return session;
  }

  async get(sessionId: string): Promise<AppSession | null> {
    const cached = this.store.get(sessionId);
    if (cached) {
      if (Date.now() > cached.expiresAt) {
        await this.destroy(sessionId);
        return null;
      }
      return cached;
    }

    const database = getDatabase();
    if (!database) {
      return null;
    }

    const rows = await database
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return null;
    }

    const session: AppSession = {
      id: row.id,
      data: row.data,
      createdAt: row.createdAt.getTime(),
      expiresAt: row.expiresAt.getTime(),
    };

    if (Date.now() > session.expiresAt) {
      await this.destroy(sessionId);
      return null;
    }

    this.store.set(sessionId, session);
    return session;
  }

  async update(sessionId: string, data: Record<string, unknown>): Promise<boolean> {
    const session = await this.get(sessionId);
    if (!session) {
      return false;
    }

    session.data = { ...session.data, ...data };
    session.expiresAt = Date.now() + this.options.maxAge;
    this.store.set(sessionId, session);

    const database = getDatabase();
    if (database) {
      await database
        .update(sessions)
        .set({
          data: session.data,
          expiresAt: new Date(session.expiresAt),
        })
        .where(eq(sessions.id, sessionId));
    }

    return true;
  }

  async destroy(sessionId: string): Promise<boolean> {
    this.store.delete(sessionId);

    const database = getDatabase();
    if (database) {
      await database.delete(sessions).where(eq(sessions.id, sessionId));
    }

    return true;
  }

  async refresh(sessionId: string): Promise<boolean> {
    const session = await this.get(sessionId);
    if (!session) {
      return false;
    }

    session.expiresAt = Date.now() + this.options.maxAge;
    this.store.set(sessionId, session);

    const database = getDatabase();
    if (database) {
      await database
        .update(sessions)
        .set({ expiresAt: new Date(session.expiresAt) })
        .where(eq(sessions.id, sessionId));
    }

    return true;
  }

  private async cleanup(): Promise<void> {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of this.store.entries()) {
      if (session.expiresAt <= now) {
        this.store.delete(id);
        cleaned++;
      }
    }

    const database = getDatabase();
    if (database) {
      await database.delete(sessions).where(lt(sessions.expiresAt, new Date(now)));
    }

    if (cleaned > 0) {
      console.log(`🧹 ${cleaned} expired session temizlendi`);
    }
  }

  private generateSessionId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  createCookieHeader(sessionId: string): string {
    const parts = [
      `${this.options.cookieName}=${sessionId}`,
      `Max-Age=${Math.floor(this.options.maxAge / 1000)}`,
      `Path=/`,
      `SameSite=${this.options.sameSite}`,
    ];

    if (this.options.httpOnly) {
      parts.push("HttpOnly");
    }

    if (this.options.secure) {
      parts.push("Secure");
    }

    return parts.join("; ");
  }

  createDeleteCookieHeader(): string {
    return `${this.options.cookieName}=; Max-Age=0; Path=/`;
  }

  getCookieName(): string {
    return this.options.cookieName;
  }

  getStats(): { total: number; active: number } {
    const now = Date.now();
    let active = 0;

    for (const session of this.store.values()) {
      if (session.expiresAt > now) {
        active++;
      }
    }

    return {
      total: this.store.size,
      active,
    };
  }

  shutdown(): void {
    clearInterval(this.cleanupTimer);
    this.store.clear();
  }
}
