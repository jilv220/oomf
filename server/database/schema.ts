import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable(
	"urls",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		longUrl: text("long_url").notNull(),
		clicks: integer("clicks").notNull().default(0),
		shortCode: text("short_code").notNull().unique(),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
		expiresAt: integer("expires_at", { mode: "timestamp" }),
	},
	(t) => [
		index("long_url_idx").on(t.longUrl),
		index("short_code_idx").on(t.shortCode),
	],
);
