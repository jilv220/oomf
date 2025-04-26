import * as R from "remeda";
import { match } from "ts-pattern";
import { shortenBodySchema } from "~/shared/shorten";
import { Shorten } from "../shorten";
import { generateTimestampedRandomCode } from "../utils/base62";
import { tables, useDrizzle } from "../utils/drizzle";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const parsedBody = shortenBodySchema.safeParse(body);

	if (parsedBody.error) {
		throw createError({
			statusCode: 422,
			message: JSON.stringify(parsedBody.error.format()),
		});
	}

	const { longUrl, customCode, expiresInDays } = parsedBody.data;

	// Generate short code - either use custom code or generate one
	let shortCode = customCode || generateTimestampedRandomCode();
	const db = useDrizzle();

	const existingUrlP = db.query.url.findFirst({
		where: (url, { eq }) => eq(url.longUrl, longUrl),
	});
	const existingCodeP = db.query.url.findFirst({
		where: (url, { eq }) => eq(url.shortCode, shortCode!),
	});
	const [existingUrl, existingCode] = await Promise.all([
		existingUrlP,
		existingCodeP,
	]);

	match([existingCode, customCode])
		.when(
			([ec, cc]) => ec && cc,
			() => {
				throw createError({
					statusCode: 409,
					message: "Custom code already in use",
				});
			},
		)
		.when(
			([ec, _]) => ec,
			() => {
				shortCode = generateTimestampedRandomCode();
			},
		);
	// only cc && nether, just fall through

	if (existingUrl && !customCode)
		return R.pick(existingUrl, ["shortCode", "longUrl", "expiresAt"]);

	const createdAt = new Date();
	const expiresAt = Shorten.getExpirationDate(createdAt, expiresInDays);

	// Insert new URL into database
	await db
		.insert(tables.url)
		.values({
			longUrl,
			shortCode,
			createdAt,
			updatedAt: createdAt,
			expiresAt,
		})
		.returning();

	return {
		shortCode,
		longUrl,
		expiresAt,
	};
});
