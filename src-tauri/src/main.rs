// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, sync::Mutex};

use rusqlite::Connection;
use tauri::State;

struct DB {
    connection: Mutex<Connection>,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn add_habit(habit_name: String, db_state: State<DB>) -> String {
    let connection = db_state.connection.lock().unwrap();
    connection
        .execute("INSERT INTO habits VALUES (?1);", [&habit_name])
        .unwrap();

    println!("Added habit: {}", habit_name);

    format!("Hello, {}! You've been greeted from Rust!", habit_name)
}

fn init_db() -> DB {
    println!("Initializing database...");

    let file_path = "habits.db";
    let mut file_exists = false;

    match fs::metadata(file_path) {
        Ok(_) => file_exists = true,
        Err(_) => (),
    }

    let connection = Connection::open(file_path).unwrap();

    if !file_exists {
        println!("Creating habits table");
        connection
            .execute("CREATE TABLE habits (name TEXT);", ())
            .unwrap();
    }

    DB {
        connection: Mutex::new(connection),
    }
}

fn main() {
    let db = init_db();

    tauri::Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![add_habit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
