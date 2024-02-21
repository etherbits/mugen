// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controllers;
mod helpers;
mod models;
use controllers::habit::HabitController;
use helpers::db::init_db;
use models::habit::HabitValues;
use tauri::{Manager, State};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn create_habit(
    serialized_habit_values: String,
    state: State<HabitController>,
) -> Result<String, String> {
    let habit_values: HabitValues = match serde_json::from_str(&serialized_habit_values) {
        Ok(habit_values) => habit_values,
        Err(err) => {
            println!("Error while deserializing habit values: {}", err);
            return Err("Error while deserializing habit values".to_string());
        }
    };

    let habit = match state.create_habit(&habit_values) {
        Ok(habit) => habit,
        Err(err) => {
            println!("Error while creating habit: {}", err);
            return Err("Error while creating habit".to_string());
        }
    };

    match serde_json::to_string(&habit) {
        Ok(habit_json) => Ok(habit_json),
        Err(err) => {
            println!("Error while serializing habit: {}", err);
            Err("Error while serializing habit".to_string())
        }
    }
}

#[tauri::command]
fn create_habit_entry(
    serialized_habit_entry_values: String,
    state: State<HabitController>,
) -> Result<String, String> {
    let habit_entry_values: models::habit::HabitEntryValues =
        match serde_json::from_str(&serialized_habit_entry_values) {
            Ok(habit_entry_values) => habit_entry_values,
            Err(err) => {
                println!("Error while deserializing habit entry values: {}", err);
                return Err("Error while deserializing habit entry values".to_string());
            }
        };

    let habit_entry = match state.create_habit_entry(&habit_entry_values) {
        Ok(habit_entry) => habit_entry,
        Err(err) => {
            println!("Error while creating habit entry: {}", err);
            return Err("Error while creating habit entry".to_string());
        }
    };

    match serde_json::to_string(&habit_entry) {
        Ok(habit_entry_json) => Ok(habit_entry_json),
        Err(err) => {
            println!("Error while serializing habit entry: {}", err);
            Err("Error while serializing habit entry".to_string())
        }
    }
}

#[tauri::command]
fn delete_habit_entry(
    habit_entry_id: i64,
    state: State<HabitController>,
) -> Result<String, String> {
    let habit_entry = match state.delete_habit_entry(habit_entry_id) {
        Ok(habit_entry) => habit_entry,
        Err(err) => {
            println!("Error while deleting habit entry: {}", err);
            return Err("Error while deleting habit entry".to_string());
        }
    };

    match serde_json::to_string(&habit_entry) {
        Ok(habit_entry_json) => Ok(habit_entry_json),
        Err(err) => {
            println!("Error while serializing habit entry: {}", err);
            Err("Error while serializing habit entry".to_string())
        }
    }
}

#[tauri::command]
fn get_all_habits_with_entries(state: State<HabitController>) -> Result<String, String> {
    let habit_with_entries = match state.get_all_habits_with_entries() {
        Ok(habit_with_entries) => habit_with_entries,
        Err(err) => {
            println!("Error while getting habit with entries: {}", err);
            return Err("Error while getting habit with entries".to_string());
        }
    };

    match serde_json::to_string(&habit_with_entries) {
        Ok(habit_with_entries_json) => Ok(habit_with_entries_json),
        Err(err) => {
            println!("Error while serializing habit with entries: {}", err);
            Err("Error while serializing habit with entries".to_string())
        }
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let data_base_path = match app.path_resolver().app_data_dir() {
                Some(dir) => dir,
                None => {
                    println!("Error while getting data directory");
                    std::process::exit(1);
                }
            };

            let db = init_db(data_base_path);
            let habit_controller = HabitController::new(db.connection);

            app.manage(habit_controller);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_habit,
            create_habit_entry,
            delete_habit_entry,
            get_all_habits_with_entries
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
