CREATE TABLE `user_exercise_completion` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`completed_at` integer NOT NULL
);
CREATE UNIQUE INDEX `user_exercise_unique` ON `user_exercise_completion` (`user_id`,`exercise_id`);
