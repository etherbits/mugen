CREATE TABLE habits (
	id INTEGER PRIMARY KEY,
	name TEXT CHECK(LENGTH(name) <= 128) NOT NULL, 
	type TEXT CHECK(type IN ("Binary", "Duration", "Amount")) NOT NULL default "Binary",
	is_archived INTEGER NOT NULL DEFAULT 0,
	creation_date TEXT NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE habit_entries (
	id INTEGER PRIMARY KEY,
	completion_date TEXT NOT NULL DEFAULT timestamp,
	habit_id INTEGER NOT NULL,
	FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

CREATE TABLE habit_duration_data (
	id INTEGER PRIMARY KEY,
	duration INTEGER NOT NULL,	
	habit_entry_id INTEGER NOT NULL,
	FOREIGN KEY(habit_entry_id) REFERENCES habits_entries(id) ON DELETE CASCADE
);

CREATE TABLE habit_amount_data (
	id INTEGER PRIMARY KEY,
	amount INTEGER NOT NULL,
	units TEXT CHECK(LENGTH(units) <= 8) NOT NULL DEFAULT "",
	habit_entry_id INTEGER NOT NULL,
	FOREIGN KEY(habit_entry_id) REFERENCES habits_entries(id) ON DELETE CASCADE
);
