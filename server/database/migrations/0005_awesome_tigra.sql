ALTER TABLE `url` ADD `userId` text REFERENCES user(id);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `url` (`userId`);