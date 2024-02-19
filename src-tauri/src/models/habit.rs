use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};

#[derive(Display, EnumString, Serialize, Deserialize)]
pub enum HabitType {
    Binary,
    Duration,
    Amount,
}

#[derive(Serialize, Deserialize)]
pub struct Habit {
    pub id: i64,
    pub name: String,
    pub habit_type: HabitType,
    pub is_archived: bool,
    pub created_at: String,
}
