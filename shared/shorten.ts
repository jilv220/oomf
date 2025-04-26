import { z } from "zod";

export const shortenFormSchema = z.object({
	longUrl: z.string().min(1, "URL is required").url("Please enter a valid URL"),
	customCode: z
		.string()
		.min(1, "Custom code must not be empty")
		.max(10, "Custom code must be less than 10 characters")
		.regex(
			/^[a-zA-Z0-9-_]+$/,
			"Only letters, numbers, hyphens and underscores are allowed",
		)
		.optional(),
});
export type ShortenForm = z.infer<typeof shortenFormSchema>;

export const shortenBodySchema = shortenFormSchema.extend({
	expiresInDays: z.number().min(1).optional(),
});
export type ShortenBody = z.infer<typeof shortenBodySchema>;
