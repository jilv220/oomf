import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	modules: ["@nuxt/ui", "@nuxthub/core"],
	css: ["~/assets/css/main.css"],
	ui: {
		colorMode: true,
	},
	devtools: { enabled: true },
	experimental: {
		componentIslands: true,
	},
	hub: {
		database: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
	nitro: {
		// https://nuxt.com/deploy/cloudflare#route-matching
		prerender: {
			crawlLinks: true,
			autoSubfolderIndex: false,
		},
	},
});
