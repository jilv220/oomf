// server/api/stats/[shortCode].get.ts
import { useDrizzle } from "../../utils/drizzle";

export default defineEventHandler(async (event) => {
	// Get the short code from the URL
	const shortCode = getRouterParam(event, "shortCode");

	if (!shortCode) {
		return {
			success: false,
			error: "Short code is required",
		};
	}

	try {
		const db = useDrizzle();

		// Look up the URL in the database
		const url = await db.query.urls.findFirst({
			where: (urls, { eq }) => eq(urls.shortCode, shortCode),
		});

		if (!url) {
			return {
				success: false,
				error: "URL not found",
			};
		}

		// Return the URL data
		return {
			success: true,
			data: {
				id: url.id,
				shortCode: url.shortCode,
				longUrl: url.longUrl,
				clicks: url.clicks,
				createdAt: url.createdAt,
				updatedAt: url.updatedAt,
			},
		};
	} catch (error) {
		console.error("Error fetching URL stats:", error);
		return {
			success: false,
			error: "Failed to fetch URL statistics",
		};
	}
});
