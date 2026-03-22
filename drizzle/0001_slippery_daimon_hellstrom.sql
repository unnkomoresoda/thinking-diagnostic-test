CREATE TABLE `diagnostic_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`baseType` varchar(8) NOT NULL,
	`cognitiveLayer` int NOT NULL,
	`processingPower` float NOT NULL,
	`dynamicShift` float NOT NULL,
	`typeName` varchar(128) NOT NULL,
	`typeCode` varchar(16) NOT NULL,
	`dimensionScores` json,
	`rawAnswers` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `diagnostic_results_id` PRIMARY KEY(`id`)
);
