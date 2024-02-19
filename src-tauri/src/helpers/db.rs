const SHOULD_RESET_DB: bool = false;

use std::{fs::read_to_string, path::PathBuf, sync::Mutex};

use rusqlite::Connection;

use crate::helpers::fs::{does_file_exist, get_string_from_path_buf};

pub struct DB {
    pub connection: Mutex<Connection>,
}

pub fn create_db_tables(connection: &Connection) {
    let create_db_query = match read_to_string("db_queries/create_db_query.sql") {
        Ok(query) => query,
        Err(_) => {
            println!("Error while reading create_db_query.sql");
            std::process::exit(1);
        }
    };

    match connection.execute(&create_db_query, ()) {
        Ok(_) => println!("DB tables created"),
        Err(_) => println!("Error while creating DB tables"),
    };
}

pub fn delete_db_tables(connection: &Connection) {
    let delete_db_query = match read_to_string("db_queries/delete_db_query.sql") {
        Ok(query) => query,
        Err(_) => {
            println!("Error while reading delete_db_query.sql");
            std::process::exit(1);
        }
    };

    match connection.execute(&delete_db_query, ()) {
        Ok(_) => println!("DB tables deleted"),
        Err(_) => println!("Error while deleting DB tables"),
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
