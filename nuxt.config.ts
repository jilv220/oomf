import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// must be later than 2024-11-24, or preview won't work
	compatibilityDate: "2025-04-02",
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
			crawlLinks: true,
			autoSubfolderIndex: false,
		},
		minify: false,
	},
	routeRules: {
		"/": { prerender: true },
	},
});
