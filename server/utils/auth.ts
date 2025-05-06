import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, anonymous } from "better-auth/plugins";
import type { EventHandler, H3Event } from "h3";

let _auth: ReturnType<typeof betterAuth>;
export function serverAuth() {
	const db = useDrizzle();

	if (!_auth) {
		_auth = betterAuth({
			database: drizzleAdapter(db, {
				provider: "sqlite",
			}),
			secondaryStorage: {
				get: (key) => hubKV().getItemRaw(`_auth:${key}`),
				set: (key, value, ttl) => {
					return hubKV().set(`_auth:${key}`, value, { ttl });
				},
				delete: (key) => hubKV().del(`_auth:${key}`),
			},
			baseURL: getBaseURL(),
			emailAndPassword: {
				enabled: true,
			},
			// socialProviders: {
			// 	github: {
			// 		clientId: process.env.GITHUB_CLIENT_ID!,
			// 		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			// 	},
			// },
			account: {
				accountLinking: {
					enabled: true,
				},
			},
			plugins: [anonymous(), admin()],
			advanced: {
				cookiePrefix: process.env.APP_NAME || "better-auth",
			},
		});
	}
	return _auth;
}

function getBaseURL() {
	let baseURL = process.env.BETTER_AUTH_URL;
	if (!baseURL) {
		try {
			baseURL = getRequestURL(useEvent()).origin;
		} catch (e) {}
	}
	return baseURL;
}

/**
 * Middleware used to require authentication for a route.
 *
 * Can be extended to check for specific roles or permissions.
 */
export const requireAuth: EventHandler = async (event: H3Event) => {
	const headers = event.headers;

	const session = await serverAuth().api.getSession({
		headers: headers,
	});
	if (!session)
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	// You can save the session to the event context for later use
	event.context.auth = session;
};
