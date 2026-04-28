CREATE TABLE `calorie_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`calories` integer NOT NULL,
	`label` text,
	`created_at` integer NOT NULL
);
