PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`start_scene_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_stories`("id", "user_id", "title", "start_scene_id", "created_at", "updated_at") SELECT "id", "user_id", "title", "start_scene_id", "created_at", "updated_at" FROM `stories`;--> statement-breakpoint
DROP TABLE `stories`;--> statement-breakpoint
ALTER TABLE `__new_stories` RENAME TO `stories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;