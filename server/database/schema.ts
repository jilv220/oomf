import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const url = sqliteTable(
	"url",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		longUrl: text("longUrl").notNull(),
		clicks: integer("clicks").notNull().default(0),
		shortCode: text("shortCode").notNull().unique(),
		createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
		updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
		expiresAt: integer("expiresAt", { mode: "timestamp" }),
		userId: text("userId").references(() => user.id),
	},
	(t) => [
		index("shortCode_idx").on(t.shortCode),
		index("user_longUrl_idx").on(t.longUrl, t.userId),
	],
);

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", {
		mode: "boolean",
	}).notNull(),
	image: text("image"),
	// Anon plugin
	isAnonymous: integer("isAnonymous", {
		mode: "boolean",
	}),
	// Admin plugin
	role: text("role").default("user"),
	banned: integer("banned", {
		mode: "boolean",
	}),
	banReason: text("banReason"),
	banExpires: integer("banExpires", {
		mode: "timestamp",
	}),
	createdAt: integer("createdAt", {
		mode: "timestamp",
	}).notNull(),
	updatedAt: integer("updatedAt", {
		mode: "timestamp",
	}).notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	token: text("token").notNull(),
	expiresAt: integer("expiresAt", {
		mode: "timestamp",
	}).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	impersonatedBy: text("impersonatedBy"),
	createdAt: integer("createdAt", {
		mode: "timestamp",
	}).notNull(),
	updatedAt: integer("updatedAt", {
		mode: "timestamp",
	}).notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	idToken: text("idToken"),
	password: text("password"),
	createdAt: integer("createdAt", {
		mode: "timestamp",
	}).notNull(),
	updatedAt: integer("updatedAt", {
		mode: "timestamp",
	}).notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", {
		mode: "timestamp",
	}).notNull(),
	createdAt: integer("createdAt", {
		mode: "timestamp",
	}).notNull(),
	updatedAt: integer("updatedAt", {
		mode: "timestamp",
	}).notNull(),
});
