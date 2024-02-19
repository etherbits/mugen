// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controllers;
mod helpers;
mod models;
use controllers::habit::HabitController;
use helpers::db::init_db;
use tauri::{Manager, State};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn create_habit(habit_name: String, state: State<HabitController>) -> String {
    let habit = match state.create_habit(&habit_name, models::habit::HabitType::Binary) {
        Ok(habit) => habit,
        Err(err) => {
            println!("Error while creating habit: {}", err);
            return "Error while creating habit".to_string();
        }
    };

    match serde_json::to_string(&habit) {
        Ok(habit_json) => habit_json,
        Err(err) => {
            println!("Error while serializing habit: {}", err);
            "Error while serializing habit".to_string()
        }
    }
}

#[tauri::command]
fn get_all_habits(state: State<HabitController>) -> String {
    let habits = match state.get_all_habits() {
        Ok(habits) => habits,
        Err(err) => {
            println!("Error while getting habits: {}", err);
            return "Error while getting habits".to_string();
        }
    };

    match serde_json::to_string(&habits) {
        Ok(habits_json) => habits_json,
        Err(err) => {
            println!("Error while serializing habits: {}", err);
            "Error while serializing habits".to_string()
        }
    }
}

#[tauri::command]
fn create_habit_entry(habit_id: i64, value: i64, state: State<HabitController>) {
    match state.create_habit_entry(habit_id, value) {
        Ok(_) => println!("Habit entry created"),
        Err(err) => println!("Error while creating habit entry: {}", err),
    }
}

#[tauri::command]
fn get_all_habit_entries(habit_id: i64, state: State<HabitController>) -> String {
    let habit_entries = match state.get_all_habit_entries(habit_id) {
        Ok(habit_entries) => habit_entries,
        Err(err) => {
            println!("Error while getting habit entries: {}", err);
            return "Error while getting habit entries".to_string();
        }
    };

    match serde_json::to_string(&habit_entries) {
        Ok(habit_entries_json) => habit_entries_json,
        Err(err) => {
            println!("Error while serializing habit entries: {}", err);
            "Error while serializing habit entries".to_string()
        }
    }
}

#[tauri::command]
fn get_all_habits_with_entries(state: State<HabitController>) -> String {
    let habit_with_entries = match state.get_all_habits_with_entries() {
        Ok(habit_with_entries) => habit_with_entries,
        Err(err) => {
            println!("Error while getting habit with entries: {}", err);
            return "Error while getting habit with entries".to_string();
        }
    };

    match serde_json::to_string(&habit_with_entries) {
        Ok(habit_with_entries_json) => habit_with_entries_json,
        Err(err) => {
            println!("Error while serializing habit with entries: {}", err);
            "Error while serializing habit with entries".to_string()
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
            get_all_habits,
            create_habit_entry,
            get_all_habit_entries,
            get_all_habits_with_entries
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
