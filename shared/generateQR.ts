import QRCode from "qrcode";

export const generateQR = async (text: string) => {
	if (text === "") return text;
	return await QRCode.toDataURL(text, {
		margin: 1,
		width: 110,
	});
};
