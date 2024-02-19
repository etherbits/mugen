use rusqlite::{Connection, Error};
use std::{str::FromStr, sync::Mutex};

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

    pub fn get_all_habits(&self) -> Result<Vec<Habit>, Error> {
        let conn = self.connection.lock().unwrap();

        let mut stmt = conn.prepare("SELECT * FROM habits")?;
        let habit_iter = stmt.query_map([], |row| {
            let type_str: String = row.get("type")?;
            let habit_type = match HabitType::from_str(type_str.as_str()) {
                Ok(habit_type) => habit_type,
                Err(_) => {
                    println!("Error while parsing habit type");
                    return Err(Error::InvalidQuery);
                }
            };

            Ok(Habit {
                id: row.get("id")?,
                name: row.get("name")?,
                habit_type,
                target: row.get("target")?,
                is_positive: row.get("is_positive")?,
                is_archived: row.get("is_archived")?,
                creation_timestamp: row.get("creation_timestamp")?,
            })
        })?;

        let mut habits = Vec::new();
        for habit in habit_iter {
            habits.push(habit?);
        }

        Ok(habits)
    }
}
