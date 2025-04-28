import type { DropdownMenuItem } from "@nuxt/ui";
import { type Ref, computed } from "vue";

interface SocialShareConfig {
	url: Ref<string>;
	text: string;
	popupOptions?: string;
}

interface SocialPlatform {
	label: string;
	icon: string;
	generateUrl: (url: string, text: string) => string;
	usePopup: boolean;
}

const platforms: SocialPlatform[] = [
	{
		label: "X / Twitter",
		icon: "fa6-brands:x-twitter",
		generateUrl: (url, text) =>
			`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${text}`)}`,
		usePopup: true,
	},
	{
		label: "Facebook",
		icon: "fa6-brands:facebook",
		generateUrl: (url) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
		usePopup: true,
	},
	{
		label: "WhatsApp",
		icon: "fa6-brands:whatsapp",
		generateUrl: (url, text) =>
			`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
		usePopup: true,
	},
	{
		label: "Email",
		icon: "i-lucide-mail",
		generateUrl: (url, text) =>
			`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
		usePopup: false,
	},
];

export function useSocialShare(config: SocialShareConfig) {
	const items = computed<DropdownMenuItem[]>(() =>
		platforms.map((platform) => ({
			label: platform.label,
			icon: platform.icon,
			onSelect: () => {
				const url = platform.generateUrl(config.url.value, config.text);
				if (platform.usePopup) {
					window.open(
						url,
						"_blank",
						config.popupOptions ||
							"width=600,height=400,toolbar=no,menubar=no,scrollbars=yes,resizable=yes",
					);
				} else {
					window.location.href = url;
				}
			},
		})),
	);

	return { items };
}
