CREATE TABLE habits (
	id INTEGER PRIMARY KEY,
	name TEXT CHECK(LENGTH(name) <= 128) NOT NULL, 
	type TEXT CHECK(type IN ("Binary", "Duration", "Amount")) NOT NULL default "Binary",
	target INTEGER NOT NULL DEFAULT 1,
	is_positive INTEGER NOT NULL DEFAULT 1,
	is_archived INTEGER NOT NULL DEFAULT 0,
	creation_timestamp DATETIME NOT NULL default (datetime('now', 'localtime'))
);

CREATE TABLE habit_entries (
	id INTEGER PRIMARY KEY,
	value INTEGER,
	completion_date DATE NOT NULL DEFAULT (date('now', 'localtime')),
	creation_timestamp DATETIME NOT NULL DEFAULT (datetime('now', 'localtime')),
	habit_id INTEGER NOT NULL,
	FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
);
