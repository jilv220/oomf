import { refreshNuxtData, useNuxtApp } from "nuxt/app";
import { eq, tables, useDrizzle } from "../utils/drizzle";

export default defineEventHandler(async (event) => {
	const shortCode = getRouterParam(event, "shortCode");

	if (!shortCode) {
		throw createError({
			statusCode: 404,
			message: "Short URL not found",
		});
	}

	try {
		const db = useDrizzle();

		// Look up the URL in the database
		const url = await db.query.url.findFirst({
			where: (url, { eq }) => eq(url.shortCode, shortCode),
		});

		if (!url) {
			throw createError({
				statusCode: 404,
				message: "Short URL not found",
			});
		}

		// Increment the click count
		await db
			.update(tables.url)
			.set({
				clicks: url.clicks + 1,
				updatedAt: new Date(),
			})
			.where(eq(tables.url.shortCode, shortCode));

		// Redirect to the long URL
		return sendRedirect(event, url.longUrl);
	} catch (error) {
		console.error("Error redirecting:", error);
		throw createError({
			statusCode: 500,
			message: "Failed to redirect to the target URL",
		});
	}
});
