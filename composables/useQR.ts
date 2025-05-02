import { generateQR } from "~/shared/generateQR";

export async function useQR(input: Ref<string>, filename: Ref<string>) {
	const qrDataUrl = ref("");
	qrDataUrl.value = await generateQR(input.value);

	function downloadQR() {
		if (!qrDataUrl.value || input.value.length === 0) return;

		const link = document.createElement("a");
		link.href = qrDataUrl.value;
		link.download = filename.value;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	return {
		qrDataUrl,
		downloadQR,
	};
}
