export default defineNuxtPlugin({
	name: "auth",
	async setup(nuxtApp) {
		const sessionToken = useState<string | null | undefined>(
			"auth:sessionToken",
			() => null,
		);

		if (import.meta.server) {
			const appName = useAppConfig().appName;
			const token = useCookie(`${appName}.session_token`);
			sessionToken.value = token.value;
		}

		if (import.meta.client) {
			if (!sessionToken.value) {
				const { signIn } = useAuth();
				await signIn.anonymous();
			}
		}
	},
});
