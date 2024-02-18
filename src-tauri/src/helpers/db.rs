const SHOULD_RESET_DB: bool = true;

use std::{path::PathBuf, sync::Mutex};

use rusqlite::Connection;

use crate::helpers::fs::{does_file_exist, get_string_from_path_buf};

pub struct DB {
    pub connection: Mutex<Connection>,
}

pub fn create_db_tables(connection: &Connection) {
    match connection.execute("
        CREATE TABLE habits (
            id INTEGER PRIMARY KEY,
            name TEXT CHECK(LENGTH(name) <= 128) NOT NULL, 
            type TEXT CHECK(type IN (\"BINARY\", \"DURATION\", \"AMOUNT\")) NOT NULL default \"BINARY\",
            creation_date TEXT NOT NULL default CURRENT_TIMESTAMP
        );",
        (),
    ) {
        Ok(_) => println!("Habits table created"),
        Err(_) => println!("Error while creating habits table"),
    };
}

pub fn delete_db_tables(connection: &Connection) {
    match connection.execute("DROP TABLE habits;", ()) {
        Ok(_) => println!("Habits table deleted"),
        Err(_) => println!("Error while deleting habits table"),
    };
}

pub fn init_db(base_data_path: PathBuf) -> DB {
    let file_path_buf = base_data_path.join("mugen.db");
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
    } else if SHOULD_RESET_DB {
        delete_db_tables(&connection);
        create_db_tables(&connection);
    }

    DB {
        connection: Mutex::new(connection),
    }
}
