import { defineEventHandler, getRouterParam, setHeader } from "h3";
import QRCode from "qrcode";

export default defineEventHandler(async (event) => {
	const shortCode = getRouterParam(event, "shortCode");
	if (!shortCode) {
		throw createError({ statusCode: 400, message: "Short code is required" });
	}

	const requestUrl = getRequestURL(event);
	const origin = requestUrl.origin;
	const shortUrl = `${origin}/${shortCode}`;

	try {
		// Generate QR code as a buffer
		const qrBuffer = await QRCode.toBuffer(shortUrl, {
			type: "png",
			margin: 1,
			width: 110,
		});

		// Set headers for file download
		setHeader(event, "Content-Type", "image/png");
		setHeader(
			event,
			"Content-Disposition",
			`attachment; filename="${shortCode}-qr.png"`,
		);

		return qrBuffer;
	} catch (error) {
		console.error("Error generating QR code:", error);
		throw createError({
			statusCode: 500,
			message: "Failed to generate QR code",
		});
	}
});
