import type { UrlInsert } from "./utils/drizzle";

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

	return newUrl;
};

async function generateUniqueShortCode(): Promise<string> {
	let shortCode: string;
	let isUnique = false;
	let i = 0;

	const db = useDrizzle();
	do {
		shortCode = generateTimestampedRandomCode();
		const existing = await db.query.url.findFirst({
			where: (url, { eq }) => eq(url.shortCode, shortCode),
		});

		isUnique = !existing;
		i++;
	} while (!isUnique && i < 5);

	return shortCode;
}

export const Shorten = {
	getExpirationDate,
	generateUniqueShortCode,
	insertUrl,
} as const;
