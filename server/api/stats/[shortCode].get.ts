import { useDrizzle } from "../../utils/drizzle";

export default defineEventHandler(async (event) => {
	const shortCode = getRouterParam(event, "shortCode");

	if (!shortCode) {
		throw createError({
			statusCode: 422,
			message: "Short code is required",
		});
	}

	const db = useDrizzle();

	// Look up the URL in the database
	const url = await db.query.urls.findFirst({
		where: (urls, { eq }) => eq(urls.shortCode, shortCode),
	});

	if (!url) {
		throw createError({
			statusCode: 404,
			message: "URL not found",
		});
	}

	return url;
});
