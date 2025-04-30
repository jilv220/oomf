DROP INDEX `longUrl_idx`;--> statement-breakpoint
DROP INDEX `userId_idx`;--> statement-breakpoint
CREATE INDEX `user_longUrl_idx` ON `url` (`longUrl`,`userId`);