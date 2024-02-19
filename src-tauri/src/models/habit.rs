use strum_macros::{Display, EnumString};

#[derive(Display, EnumString)]
pub enum HabitType {
    Binary,
    Duration,
    Amount,
}

pub struct Habit {
    pub id: i64,
    pub name: String,
    pub habit_type: HabitType,
    pub is_archived: bool,
    pub created_at: String,
}
