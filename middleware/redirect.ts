export default defineNuxtRouteMiddleware(async (to) => {
	const shortCode = to.params.shortCode as string;

	if (!shortCode) {
		return abortNavigation();
	}

	try {
		// Call our API endpoint to handle the redirection
		// This will trigger the server-side redirect
		return navigateTo(`/api/${shortCode}`, { external: true });
	} catch (error) {
		console.error("Error in redirect middleware:", error);
		// Redirect to home page if there's an error
		return navigateTo("/");
	}
});
