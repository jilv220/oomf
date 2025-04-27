export function useOrigin() {
	const origin = ref("");

	// Get the origin in a way that works for SSR
	if (import.meta.client) {
		// Client-side: Use window.location.origin
		origin.value = window.location.origin;
	} else {
		// Server-side: Use useRequestURL to get the origin
		const requestUrl = useRequestURL();
		origin.value = requestUrl.origin;
	}

	return origin;
}
