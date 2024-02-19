use rusqlite::{Connection, Error};
use std::sync::Mutex;

use crate::models::habit::{Habit, HabitType};

pub struct HabitController {
    connection: Mutex<Connection>,
}

impl HabitController {
    pub fn new(connection: Mutex<Connection>) -> Self {
        Self { connection }
    }

    pub fn create_habit(&self, name: &str, habit_type: HabitType) -> Result<Habit, Error> {
        let conn = self.connection.lock().unwrap();

        conn.execute(
            "INSERT INTO habits (name, type) VALUES ($1, $2)",
            [name, habit_type.to_string().as_str()],
        )?;

        let id = conn.last_insert_rowid();

        let data = conn.query_row("SELECT * FROM habits WHERE id = $1", [id], |row| {
            Ok(Habit {
                id,
                name: row.get("name")?,
                habit_type,
                target: row.get("target")?,
                is_positive: row.get("is_positive")?,
                is_archived: row.get("is_archived")?,
                creation_timestamp: row.get("creation_timestamp")?,
            })
        })?;

        Ok(data)
    }
}
