import * as R from "remeda";

import type { User } from "better-auth";
import { match } from "ts-pattern";
import { TOO_MANY_SHORTENED_URLS } from "~/shared/errorCodes";
import { shortenBodySchema } from "~/shared/shorten";
import { Shorten } from "../shorten";
import { requireAuth } from "../utils/auth";
import { useDrizzle } from "../utils/drizzle";

export default defineEventHandler({
	onRequest: [requireAuth],
	handler: async (event) => {
		const body = await readBody(event);
		const parsedBody = shortenBodySchema.safeParse(body);

		if (parsedBody.error) {
			throw createError({
				statusCode: 400,
				message: JSON.stringify(parsedBody.error.format()),
			});
		}

		const { longUrl, customCode, expiresInDays } = parsedBody.data;
		const db = useDrizzle();
		const user: User = event.context.auth.user;
		const userId = user.id;

		const existingUrls = await Shorten.getExistingUrls(userId, longUrl);
		const res = await match([existingUrls.length !== 0, customCode])
			.when(
				([eu, cc]) => eu && !cc,
				() => {
					// return eu
					return R.pipe(
						existingUrls,
						R.map(R.pick(["shortCode", "longUrl", "expiresAt"])),
					);
				},
			)
			.when(
				([eu, cc]) => !eu && !cc,
				async () => {
					const shortCode = await Shorten.generateUniqueShortCode(
						userId,
						longUrl,
					);
					const newUrl = await Shorten.insertUrl(
						{
							longUrl,
							shortCode,
							userId,
						},
						expiresInDays,
					);

					return [
						{
							shortCode: newUrl.shortCode,
							longUrl: newUrl.longUrl,
							expiresAt: newUrl.expiresAt,
						},
					];
				},
			)
			.otherwise(async ([_eu, cc]) => {
				if (existingUrls.length > 1) {
					throw createError({
						statusCode: 409,
						data: {
							errorCode: TOO_MANY_SHORTENED_URLS,
						},
					});
				}

				const customCodeExists = await db.query.url.findFirst({
					where: (url, { eq }) => eq(url.shortCode, cc!),
				});

				if (customCodeExists) {
					throw createError({
						statusCode: 409,
						statusMessage: "Custom code already in use",
					});
				}

				const newUrl = await Shorten.insertUrl(
					{
						longUrl,
						shortCode: cc!,
						userId,
					},
					expiresInDays,
				);

				return [
					{
						shortCode: newUrl.shortCode,
						longUrl: newUrl.longUrl,
						expiresAt: newUrl.expiresAt,
					},
				];
			});

		return res;
	},
});
