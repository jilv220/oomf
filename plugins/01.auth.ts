export default defineNuxtPlugin({
	name: "auth",
	async setup(nuxtApp) {
		const sessionToken = useState<string | null | undefined>(
			"auth:sessionToken",
			() => null,
		);

		if (import.meta.server) {
			const userSession = await useAuth().fetchSession();
			sessionToken.value = userSession?.session.token || null;
		}

		if (import.meta.client) {
			if (!sessionToken.value) {
				const { signIn } = useAuth();
				await signIn.anonymous();
			}
		}
	},
});
