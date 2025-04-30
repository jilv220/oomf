import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-09-18",
	modules: ["@nuxt/ui", "@nuxthub/core", "@nuxt/image"],
	css: ["~/assets/css/main.css"],
	ui: {
		colorMode: false,
	},
	devtools: { enabled: true },
	experimental: {
		componentIslands: true,
		asyncContext: true,
	},
	hub: {
		database: true,
		kv: true,
		bindings: {
			observability: {
				logs: true,
			},
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	nitro: {
		// https://nuxt.com/deploy/cloudflare#route-matching
		prerender: {
			crawlLinks: false,
			autoSubfolderIndex: false,
		},
	},
});
