import * as R from "remeda";
import { z } from "zod";
import {
	encodeBase62,
	generateRandomCode,
	generateTimestampedRandomCode,
} from "../utils/base62";
import { tables, useDrizzle } from "../utils/drizzle";

// Define validation schema for the request
const urlSchema = z.object({
	longUrl: z
		.string()
		.url("Please provide a valid URL")
		.min(1, "URL is required"),
	customCode: z.string().optional(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const parsedBody = urlSchema.safeParse(body);
	if (parsedBody.error) {
		throw createError({
			statusCode: 422,
			message: JSON.stringify(parsedBody.error.format()),
		});
	}

	const { longUrl, customCode } = parsedBody.data;

	const db = useDrizzle();

	// Check if URL already exists in database
	const existingUrl = await db.query.urls.findFirst({
		where: (urls, { eq }) => eq(urls.longUrl, longUrl),
	});
	if (existingUrl) return R.pick(existingUrl, ["shortCode", "longUrl"]);

	// Generate short code - either use custom code or generate one
	let shortCode = customCode;
	if (!shortCode) shortCode = generateTimestampedRandomCode();

	// Check if short code already exists
	const existingCode = await db.query.urls.findFirst({
		where: (urls, { eq }) => eq(urls.shortCode, shortCode!),
	});

	if (existingCode) {
		// If code exists and custom code was requested, return error
		if (customCode) {
			throw createError({
				statusCode: 409,
				message: "Custom code already in use",
			});
		}

		// Otherwise, generate a new random code
		shortCode = generateRandomCode();
	}

	// Insert new URL into database
	const now = new Date();
	await db
		.insert(tables.urls)
		.values({
			longUrl,
			shortCode,
			createdAt: now,
			updatedAt: now,
		})
		.returning();

	return {
		shortCode,
		longUrl,
	};
});
