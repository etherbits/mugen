// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controllers;
mod models;
mod helpers;
use controllers::habit::HabitController;
use helpers::db::init_db;
use tauri::{Manager, State};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn add_habit(habit_name: String, db_state: State<HabitController>) -> String {

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

            app.manage(db);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![add_habit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
