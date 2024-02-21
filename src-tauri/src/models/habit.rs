use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(Copy, Clone, Display, EnumString, Serialize, Deserialize, TS)]
#[ts(export)]
pub enum HabitType {
    Binary,
    Duration,
    Amount,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Habit {
    pub id: i64,
    pub name: String,
    pub habit_type: HabitType,
    pub target: i32,
    pub is_positive: bool,
    pub is_archived: bool,
    pub creation_timestamp: String,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct HabitValues {
    pub name: String,
    pub habit_type: HabitType,
    pub target: Option<i32>,
    pub is_positive: Option<bool>,
    pub is_archived: Option<bool>,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct HabitEntry {
    pub id: i64,
    pub habit_id: i64,
    pub value: Option<i32>,
    pub completion_date: String,
    pub creation_timestamp: String,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct HabitEntryValues {
    pub habit_id: i64,
    pub value: Option<i32>,
    pub completion_date: String,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct HabitWithEntries {
    pub habit: Habit,
    pub entries: Vec<HabitEntry>,
}
