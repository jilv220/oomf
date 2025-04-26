export default defineAppConfig({
	appName: process.env.APP_NAME || "OomF",
	ui: {
		colors: {
			primary: "jade",
			success: "jade",
			error: "red",
			neutral: "coral",
		},
		card: {
			variants: {
				variant: {
					// Make the style elvated to match 4chan post
					soft: {
						root: "border-b-1 border-r-1 border-[var(--ui-border)]",
					},
				},
			},
		},
	},
});
