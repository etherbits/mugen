use std::{fs, path::PathBuf};

pub fn get_string_from_path_buf(path_buf: PathBuf) -> String {
    match path_buf.into_os_string().into_string() {
        Ok(file_path) => file_path,
        Err(_) => {
            println!("Error while converting file path to string");
            std::process::exit(1);
        }
    }
}

pub fn does_file_exist(file_path: &str) -> bool {
    match fs::metadata(file_path) {
        Ok(_) => true,
        Err(_) => false,
    }
}
