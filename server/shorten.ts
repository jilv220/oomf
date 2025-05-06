import { createHash } from "node:crypto";
import { z } from "zod";
import type { Url, UrlInsert } from "./utils/drizzle";

const getExistingUrls = async (userId: string, longUrl: string) => {
	const cacheKey = `urls:${userId}:${longUrl}`;
	const kv = hubKV();
	const cached = await kv.get<Url[]>(cacheKey);
	if (cached) {
		return cached;
	}

	const db = useDrizzle();
	const existingUrls = await db.query.url.findMany({
		where: (url, { eq, and }) =>
			and(eq(url.longUrl, longUrl), eq(url.userId, userId)),
	});

	await kv.set(cacheKey, existingUrls, { ttl: 24 * 60 * 60 });
	return existingUrls;
};

const getExpirationDate = (
	createdAt: Date,
	expiresInDays: number | undefined,
) => {
	return expiresInDays
		? new Date(createdAt.getTime() + expiresInDays * 24 * 60 * 60 * 1000)
		: new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
};

const insertUrl = async (
	{
		longUrl,
		shortCode,
		userId,
	}: Pick<UrlInsert, "longUrl" | "shortCode" | "userId">,
	expiresInDays: number,
) => {
	const createdAt = new Date();
	const expiresAt = Shorten.getExpirationDate(createdAt, expiresInDays);

	const db = useDrizzle();
	const [newUrl] = await db
		.insert(tables.url)
		.values({
			longUrl,
			shortCode,
			createdAt,
			updatedAt: createdAt,
			expiresAt,
			userId,
		})
		.returning();

	if (userId) {
		await Shorten.invalidateCache(userId, longUrl);
	}

	return newUrl;
};

async function invalidateCache(userId: string, longUrl: string) {
	const cacheKey = `urls:${userId}:${longUrl}`;
	const kv = hubKV();
	await kv.del(cacheKey);
}

async function generateUniqueShortCode(
	userId: string,
	longUrl: string,
): Promise<string> {
	const hash = createHash("sha256")
		.update(`${userId}:${longUrl}`)
		.digest("hex");

	const { data: shortCodeLength } = z
		.number()
		.int()
		.safeParse(process.env.APP_SHORT_CODE_LENGTH);

	return encodeBase62(Number.parseInt(hash.slice(0, 8), 16)).slice(
		0,
		shortCodeLength || 6,
	);
}

export const Shorten = {
	getExistingUrls,
	getExpirationDate,
	generateUniqueShortCode,
	insertUrl,
	invalidateCache,
} as const;
