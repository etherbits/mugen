use rusqlite::{Connection, Error};
use std::sync::Mutex;

use crate::models::habit::{Habit, HabitType};

pub struct HabitController {
    connection: Mutex<Connection>,
}

impl HabitController {
    pub fn create_habit(&self, name: &str, habit_type: HabitType) -> Result<Habit, Error> {
        let mut conn = self.connection.lock().unwrap();

        conn.execute(
            "INSERT INTO habits (name, habit_type) VALUES ($1, $2)",
            [name, habit_type.to_string().as_str()],
        )?;

        let id = conn.last_insert_rowid();

        let data = conn.query_row("SELECT * FROM habits WHERE id = $1", [id], |row| {
            Ok(Habit {
                id,
                name: row.get(1)?,
                habit_type,
                is_archived: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?;

        Ok(data)
    }
}
