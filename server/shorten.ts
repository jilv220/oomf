const getExpirationDate = (
	createdAt: Date,
	expiresInDays: number | undefined,
) => {
	return expiresInDays
		? new Date(createdAt.getTime() + expiresInDays * 24 * 60 * 60 * 1000)
		: new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
};

export const Shorten = {
	getExpirationDate,
} as const;
