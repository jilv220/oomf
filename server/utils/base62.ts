// server/utils/base62.ts

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

export const generateTimestampedRandomCode = () => {
	const now = Date.now();
	const randomSuffix = Math.floor(Math.random() * 10000);
	const idBase = now * 10000 + randomSuffix;

	let shortCode = encodeBase62(idBase);

	// Ensure the code is at least 6 characters
	// If too long, use a random code instead
	if (shortCode.length < 6) {
		shortCode = shortCode.padStart(6, "0");
	} else if (shortCode.length > 8) {
		shortCode = generateRandomCode();
	}
	return shortCode;
};
