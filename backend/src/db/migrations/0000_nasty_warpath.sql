CREATE TABLE `addons` (
	`id` text PRIMARY KEY NOT NULL,
	`class_id` text,
	`event_id` text,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `booking_addons` (
	`booking_id` text NOT NULL,
	`addon_id` text NOT NULL,
	PRIMARY KEY(`booking_id`, `addon_id`),
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`class_id` text,
	`event_id` text,
	`pack_id` text,
	`schedule_id` text,
	`payment_id` text,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT '2025-07-15T15:28:01.902Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `class_attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`class_id` text NOT NULL,
	`session_date` text NOT NULL,
	`attended` integer DEFAULT true,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `class_packs` (
	`id` text PRIMARY KEY NOT NULL,
	`class_type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`number_of_sessions` integer NOT NULL,
	`price` integer NOT NULL,
	`duration` integer NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `class_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`day_of_week` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`instructions` text,
	`location` text NOT NULL,
	`thumbnail` text,
	`gallery` text,
	`max_spots` integer NOT NULL,
	`booked_spots` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true,
	`class_pack_ids` text DEFAULT '[]',
	`class_schedule_ids` text DEFAULT '[]',
	`created_at` text DEFAULT '2025-07-15T15:28:01.901Z'
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`message` text NOT NULL,
	`created_at` text DEFAULT '2025-07-15T15:28:01.902Z'
);
--> statement-breakpoint
CREATE TABLE `event_attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`event_id` text NOT NULL,
	`checked_in_at` text NOT NULL,
	`attended` integer DEFAULT true,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`instructions` text,
	`location` text,
	`thumbnail` text,
	`gallery` text,
	`is_recurring` integer DEFAULT false,
	`repeat_pattern` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`max_spots` integer NOT NULL,
	`booked_spots` integer DEFAULT 0,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2025-07-15T15:28:01.902Z'
);
--> statement-breakpoint
CREATE TABLE `trainers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`bio` text,
	`phone` text,
	`email` text NOT NULL,
	`profile_image` text,
	`specializations` text,
	`created_at` text DEFAULT '2025-07-15T15:28:01.902Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `trainers_phone_unique` ON `trainers` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `trainers_email_unique` ON `trainers` (`email`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` text DEFAULT '2025-07-15T15:28:01.900Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);