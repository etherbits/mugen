// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

const SHOULD_RESET_DB: bool = true;

mod helpers;

use helpers::fs::{does_file_exist, get_string_from_path_buf};

use rusqlite::Connection;
use std::{path::PathBuf, sync::Mutex};
use tauri::{Manager, State};

struct DB {
    connection: Mutex<Connection>,
}

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

    format!("Hello, {}! You've been greeted from Rust!", habit_name)
}

fn create_db_tables(connection: &Connection) {
    match connection.execute("CREATE TABLE habits (name TEXT);", ()) {
        Ok(_) => println!("Habits table created"),
        Err(_) => println!("Error while creating habits table"),
    };
}

fn delete_db_tables(connection: &Connection) {
    match connection.execute("DROP TABLE habits;", ()) {
        Ok(_) => println!("Habits table deleted"),
        Err(_) => println!("Error while deleting habits table"),
    };
}

fn init_db(base_data_path: PathBuf) -> DB {
    let file_path_buf = base_data_path.join("habits.db");
    let file_path = get_string_from_path_buf(file_path_buf);
    let file_exists = does_file_exist(&file_path);

    println!("Database file path: {}", file_path);

    let connection = match Connection::open(&file_path) {
        Ok(connection) => connection,
        Err(_) => {
            println!("Error while opening database");
            std::process::exit(1);
        }
    };

    if !file_exists {
        create_db_tables(&connection);
    }

    if SHOULD_RESET_DB {
        delete_db_tables(&connection);
        create_db_tables(&connection);
    }

    DB {
        connection: Mutex::new(connection),
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
            app.manage(db);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![add_habit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
