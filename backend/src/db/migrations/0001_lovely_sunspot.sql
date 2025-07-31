PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`instructions` text,
	`location` text,
	`thumbnail` text,
	`gallery` text,
	`is_recurring` integer DEFAULT false,
	`repeat_pattern` text,
	`start_datetime` text NOT NULL,
	`end_datetime` text,
	`addon_ids` text DEFAULT '[]',
	`max_spots` integer NOT NULL,
	`booked_spots` integer DEFAULT 0,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2025-07-16T05:12:26.271Z'
);
--> statement-breakpoint
INSERT INTO `__new_events`("id", "title", "description", "instructions", "location", "thumbnail", "gallery", "is_recurring", "repeat_pattern", "start_datetime", "end_datetime", "addon_ids", "max_spots", "booked_spots", "is_active", "created_at") SELECT "id", "title", "description", "instructions", "location", "thumbnail", "gallery", "is_recurring", "repeat_pattern", "start_datetime", "end_datetime", "addon_ids", "max_spots", "booked_spots", "is_active", "created_at" FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`class_id` text,
	`event_id` text,
	`pack_id` text,
	`schedule_id` text,
	`payment_id` text,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT '2025-07-16T05:12:26.271Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_bookings`("id", "user_id", "class_id", "event_id", "pack_id", "schedule_id", "payment_id", "status", "created_at") SELECT "id", "user_id", "class_id", "event_id", "pack_id", "schedule_id", "payment_id", "status", "created_at" FROM `bookings`;--> statement-breakpoint
DROP TABLE `bookings`;--> statement-breakpoint
ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint
CREATE TABLE `__new_classes` (
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
	`created_at` text DEFAULT '2025-07-16T05:12:26.271Z'
);
--> statement-breakpoint
INSERT INTO `__new_classes`("id", "title", "description", "instructions", "location", "thumbnail", "gallery", "max_spots", "booked_spots", "is_active", "class_pack_ids", "class_schedule_ids", "created_at") SELECT "id", "title", "description", "instructions", "location", "thumbnail", "gallery", "max_spots", "booked_spots", "is_active", "class_pack_ids", "class_schedule_ids", "created_at" FROM `classes`;--> statement-breakpoint
DROP TABLE `classes`;--> statement-breakpoint
ALTER TABLE `__new_classes` RENAME TO `classes`;--> statement-breakpoint
CREATE TABLE `__new_enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`message` text NOT NULL,
	`created_at` text DEFAULT '2025-07-16T05:12:26.272Z'
);
--> statement-breakpoint
INSERT INTO `__new_enquiries`("id", "name", "email", "phone", "message", "created_at") SELECT "id", "name", "email", "phone", "message", "created_at" FROM `enquiries`;--> statement-breakpoint
DROP TABLE `enquiries`;--> statement-breakpoint
ALTER TABLE `__new_enquiries` RENAME TO `enquiries`;--> statement-breakpoint
CREATE TABLE `__new_trainers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`bio` text,
	`phone` text,
	`email` text NOT NULL,
	`profile_image` text,
	`specializations` text,
	`created_at` text DEFAULT '2025-07-16T05:12:26.272Z'
);
--> statement-breakpoint
INSERT INTO `__new_trainers`("id", "name", "bio", "phone", "email", "profile_image", "specializations", "created_at") SELECT "id", "name", "bio", "phone", "email", "profile_image", "specializations", "created_at" FROM `trainers`;--> statement-breakpoint
DROP TABLE `trainers`;--> statement-breakpoint
ALTER TABLE `__new_trainers` RENAME TO `trainers`;--> statement-breakpoint
CREATE UNIQUE INDEX `trainers_phone_unique` ON `trainers` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `trainers_email_unique` ON `trainers` (`email`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` text DEFAULT '2025-07-16T05:12:26.269Z'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "first_name", "last_name", "email", "phone", "password_hash", "role", "created_at") SELECT "id", "first_name", "last_name", "email", "phone", "password_hash", "role", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);