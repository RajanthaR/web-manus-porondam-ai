CREATE TABLE `horoscope_charts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`personName` varchar(255),
	`gender` enum('male','female'),
	`birthDate` timestamp,
	`birthTime` varchar(20),
	`birthPlace` varchar(255),
	`nakshatra` int,
	`nakshatraPada` int,
	`rashi` int,
	`planetaryPositions` json,
	`imageUrl` text,
	`imageKey` varchar(512),
	`extractedText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `horoscope_charts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matching_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`chart1Id` int,
	`chart2Id` int,
	`overallScore` decimal(5,2),
	`porondamScores` json,
	`analysis` text,
	`recommendations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matching_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `horoscope_charts` ADD CONSTRAINT `horoscope_charts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matching_results` ADD CONSTRAINT `matching_results_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matching_results` ADD CONSTRAINT `matching_results_chart1Id_horoscope_charts_id_fk` FOREIGN KEY (`chart1Id`) REFERENCES `horoscope_charts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matching_results` ADD CONSTRAINT `matching_results_chart2Id_horoscope_charts_id_fk` FOREIGN KEY (`chart2Id`) REFERENCES `horoscope_charts`(`id`) ON DELETE no action ON UPDATE no action;