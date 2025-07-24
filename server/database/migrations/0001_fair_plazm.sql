PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_scene_transitions` (
	`id` text PRIMARY KEY NOT NULL,
	`story_id` text NOT NULL,
	`source_scene_id` text NOT NULL,
	`target_scene_id` text,
	`option_text` text NOT NULL,
	FOREIGN KEY (`story_id`) REFERENCES `stories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_scene_id`) REFERENCES `scenes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_scene_id`) REFERENCES `scenes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_scene_transitions`("id", "story_id", "source_scene_id", "target_scene_id", "option_text") SELECT "id", "story_id", "source_scene_id", "target_scene_id", "option_text" FROM `scene_transitions`;--> statement-breakpoint
DROP TABLE `scene_transitions`;--> statement-breakpoint
ALTER TABLE `__new_scene_transitions` RENAME TO `scene_transitions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `scenes` DROP COLUMN `text`;