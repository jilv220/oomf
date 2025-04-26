ALTER TABLE `urls` RENAME TO `url`;--> statement-breakpoint
ALTER TABLE `url` RENAME COLUMN "long_url" TO "longUrl";--> statement-breakpoint
ALTER TABLE `url` RENAME COLUMN "short_code" TO "shortCode";--> statement-breakpoint
ALTER TABLE `url` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE `url` RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE `url` RENAME COLUMN "expires_at" TO "expiresAt";--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`idToken` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`impersonatedBy` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`isAnonymous` integer,
	`role` text DEFAULT 'user',
	`banned` integer,
	`banReason` text,
	`banExpires` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
DROP INDEX `urls_short_code_unique`;--> statement-breakpoint
DROP INDEX `long_url_idx`;--> statement-breakpoint
DROP INDEX `short_code_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `url_shortCode_unique` ON `url` (`shortCode`);--> statement-breakpoint
CREATE INDEX `long_url_idx` ON `url` (`longUrl`);--> statement-breakpoint
CREATE INDEX `short_code_idx` ON `url` (`shortCode`);