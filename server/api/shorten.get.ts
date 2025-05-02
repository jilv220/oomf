import type { User } from "better-auth";
import { count } from "drizzle-orm";
import * as R from "remeda";
import { z } from "zod";

const listQuerySchema = z.object({
	page: z.coerce.number().default(1),
	limit: z.coerce.number().default(20),
});

export default defineEventHandler({
	onRequest: [requireAuth],
	handler: async (event) => {
		const user: User = event.context.auth.user;
		const db = useDrizzle();

		const parsedQuery = await getValidatedQuery(event, (data) =>
			listQuerySchema.safeParse(data),
		);

		if (parsedQuery.error) {
			throw createError({
				statusCode: 400,
				message: JSON.stringify(parsedQuery.error.format()),
			});
		}

		const { page, limit } = parsedQuery.data;
		const offset = (page - 1) * limit;

		const urlsP = db.query.url.findMany({
			where: (url, { eq }) => eq(url.userId, user.id),
			orderBy: (url, { desc }) => [desc(url.createdAt)],
			offset,
			limit,
		});
		const totalP = db
			.select({
				count: count(),
			})
			.from(tables.url)
			.where(eq(tables.url.userId, user.id));

		const [urls, [total]] = await Promise.all([urlsP, totalP]);

		return {
			urls: R.pipe(
				urls,
				R.map(
					R.pick(["longUrl", "shortCode", "createdAt", "expiresAt", "clicks"]),
				),
			),
			pagination: {
				total: total.count,
				page,
				limit,
				totalPages: Math.ceil(total.count / limit),
			},
		};
	},
});
