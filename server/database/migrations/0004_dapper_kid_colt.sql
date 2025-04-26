DROP INDEX `long_url_idx`;--> statement-breakpoint
DROP INDEX `short_code_idx`;--> statement-breakpoint
CREATE INDEX `longUrl_idx` ON `url` (`longUrl`);--> statement-breakpoint
CREATE INDEX `shortCode_idx` ON `url` (`shortCode`);