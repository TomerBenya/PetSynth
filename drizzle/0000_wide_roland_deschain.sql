CREATE TABLE `generations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`prompt` text,
	`model` text,
	`input_tokens` integer,
	`output_tokens` integer,
	`cost_usd` real,
	`latency_ms` integer,
	`created_at` integer DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`species` text,
	`traits_json` text,
	`description` text,
	`care_instructions` text,
	`price_cents` integer,
	`image_url` text,
	`status` text,
	`created_by_user_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_pets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`pet_id` text NOT NULL,
	`added_at` integer DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pet_id`) REFERENCES `pets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_pets_user_id_pet_id_unique` ON `user_pets` (`user_id`,`pet_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text,
	`created_at` integer DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);