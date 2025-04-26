/**
 * Base62 character set for URL shortening (a-z, A-Z, 0-9)
 */
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = CHARS.length; // 62

/**
 * Encodes a number to a base62 string
 * @param num - Number to encode
 * @returns Base62 encoded string
 */
export function encodeBase62(num: number): string {
	if (num === 0) return CHARS[0];
	let urlId = num;

	let encoded = "";
	while (urlId > 0) {
		encoded = CHARS[urlId % BASE] + encoded;
		urlId = Math.floor(urlId / BASE);
	}

	return encoded;
}

/**
 * Decodes a base62 string to a number
 * @param str - Base62 encoded string
 * @returns Decoded number
 */
export function decodeBase62(str: string): number {
	let decoded = 0;

	for (let i = 0; i < str.length; i++) {
		const char = str[i];
		const charIndex = CHARS.indexOf(char);

		if (charIndex === -1) {
			throw new Error(`Invalid character in base62 string: ${char}`);
		}

		decoded = decoded * BASE + charIndex;
	}

	return decoded;
}

/**
 * Generates a random short code of specified length
 * @param length - Length of short code to generate
 * @returns Random short code
 */
export function generateRandomCode(length = 6): string {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += CHARS.charAt(Math.floor(Math.random() * BASE));
	}
	return result;
}

export const generateTimestampedRandomCode = (length = 6): string => {
	const timestamp = Math.floor(Date.now() / 1000); // Seconds since epoch
	const randomPart = Math.floor(Math.random() * 10000); // 4-digit random
	const idBase = timestamp * 10000 + randomPart;
	let shortCode = encodeBase62(idBase);

	// Truncate or pad to desired length
	if (shortCode.length > length) {
		shortCode = shortCode.slice(0, length);
	} else if (shortCode.length < length) {
		shortCode = generateRandomCode(length); // Fallback to random
	}
	return shortCode;
};
