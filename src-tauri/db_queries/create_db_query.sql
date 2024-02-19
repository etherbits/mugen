CREATE TABLE habits (
	id INTEGER PRIMARY KEY,
	name TEXT CHECK(LENGTH(name) <= 128) NOT NULL, 
	type TEXT CHECK(type IN ("Binary", "Duration", "Amount")) NOT NULL default "Binary",
	target INTEGER NOT NULL DEFAULT 1,
	is_positive INTEGER NOT NULL DEFAULT 1,
	is_archived INTEGER NOT NULL DEFAULT 0,
	creation_timestamp DATETIME NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE habit_entries (
	id INTEGER PRIMARY KEY,
	value INTEGER,
	creation_timestamp DATETIME NOT NULL DEFAULT timestamp,
	habit_id INTEGER NOT NULL,
	FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
);
