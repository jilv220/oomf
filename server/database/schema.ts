import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable("urls", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	longUrl: text("long_url").notNull(),
	clicks: integer("clicks").notNull().default(0),
	shortCode: text("short_code").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }),
});
