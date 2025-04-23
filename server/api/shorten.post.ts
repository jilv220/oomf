import { DrizzleD1Database } from "drizzle-orm/d1";
import { z } from "zod";
import { encodeBase62, generateRandomCode } from "../utils/base62";
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
	try {
		// Parse and validate request body
		const body = await readBody(event);
		const parsedBody = urlSchema.safeParse(body);

		if (parsedBody.error) {
			return {
				success: false,
				error: parsedBody.error.format(),
			};
		}

		const { longUrl, customCode } = parsedBody.data;
		const db = useDrizzle();

		// Check if URL already exists in database
		const existingUrl = await db.query.urls.findFirst({
			where: (urls, { eq }) => eq(urls.longUrl, longUrl),
		});

		if (existingUrl) {
			return {
				success: true,
				data: {
					shortCode: existingUrl.shortCode,
					longUrl: existingUrl.longUrl,
				},
			};
		}

		// Generate short code - either use custom code or generate one
		let shortCode = customCode;
		if (!shortCode) {
			// Use ID-based encoding
			const now = Date.now();
			const randomSuffix = Math.floor(Math.random() * 10000);
			const idBase = now * 10000 + randomSuffix; // Create a unique number
			shortCode = encodeBase62(idBase);

			// Ensure the code is at least 6 characters
			if (shortCode.length < 6) {
				shortCode = shortCode.padStart(6, "0");
			} else if (shortCode.length > 8) {
				// If too long, use a random code instead
				shortCode = generateRandomCode();
			}
		}

		// Check if short code already exists
		const existingCode = await db.query.urls.findFirst({
			where: (urls, { eq }) => eq(urls.shortCode, shortCode!),
		});

		if (existingCode) {
			// If code exists and custom code was requested, return error
			if (customCode) {
				return {
					success: false,
					error: "Custom code already in use",
				};
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
			success: true,
			data: {
				shortCode,
				longUrl,
				isExisting: false,
			},
		};
	} catch (error) {
		console.error("Error shortening URL:", error);
		return {
			success: false,
			error: "Failed to shorten URL. Please try again.",
		};
	}
});
