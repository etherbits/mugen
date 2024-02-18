// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod helpers;
use helpers::db::{init_db, DB};
use tauri::{Manager, State};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn add_habit(habit_name: String, db_state: State<DB>) -> String {
    let connection = match db_state.connection.lock() {
        Ok(connection) => connection,
        Err(_) => return "Server Error".to_string(),
    };

    match connection.execute("INSERT INTO habits VALUES (?1);", [&habit_name]) {
        Ok(_) => println!("Habit added to database"),
        Err(_) => {
            println!("Error while adding habit to database");
            return "Server Error".to_string();
        }
    }

    format!("{} was added to the db", habit_name)
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
