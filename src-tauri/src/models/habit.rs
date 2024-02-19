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
    pub target: i64,
    pub is_positive: bool,
    pub is_archived: bool,
    pub creation_timestamp: String,
}
