// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Serialize, Deserialize, Debug)]
struct Song {
    id: u32,
    title: String,
    artist: String,
    url: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Playlist {
    id: u32,
    name: String,
    song_ids: Vec<u32>,
}


#[derive(Serialize, Deserialize, Debug)]
struct Settings {
    last_played_song_id: u32,
    volume: f32,
    repeat: bool,
    shuffle: bool,
}

#[derive(Serialize, Deserialize, Debug)]
struct MusicAppData {
    songs: Vec<Song>,
    playlists: Vec<Playlist>,
    settings: Settings,
}

#[tauri::command]
fn load(filedir: String) -> Result<MusicAppData, String> {
    if let Ok(data) = std::fs::read_to_string(filedir) {
        let music_data: MusicAppData = serde_json::from_str(&data).unwrap();
        Ok(music_data)
    } else {
        Err("Failed to load music data".into())
    }
}

#[tauri::command]
fn save(filedir: String, data: MusicAppData) -> Result<(), String> {
    let json_data = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;
    fs::write(filedir, json_data).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load, save])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
