export default defineNuxtPlugin({
	name: "better-auth-fetch-plugin-client",
	async setup(nuxtApp) {
		if (!nuxtApp.payload.serverRendered) {
			await useAuth().fetchSession();
		} else if (
			Boolean(nuxtApp.payload.prerenderedAt) ||
			Boolean(nuxtApp.payload.isCached)
		) {
			nuxtApp.hook("app:mounted", async () => {
				await useAuth().fetchSession();
			});
		} else if (import.meta.client) {
			const userSession = await useAuth().fetchSession();
			if (!userSession?.session.token) {
				const { signIn } = useAuth();
				await signIn.anonymous();
				console.log("wut");
			}
		}
	},
});
