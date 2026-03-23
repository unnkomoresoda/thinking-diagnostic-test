CREATE TABLE `question_patterns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patternType` enum('layer','power','shift') NOT NULL,
	`patternIndex` int NOT NULL,
	`questions` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `question_patterns_id` PRIMARY KEY(`id`)
);
