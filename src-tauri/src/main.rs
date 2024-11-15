// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::process::Command;

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
    playlistid: u32,
    songid: u32,
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

//custom command to get m3u8 file using yt-dlp 'yt-dlp -g -f "bestaudio" --no-playlist <URL_DEL_VIDEO>'
#[tauri::command]
fn getm3u8(url: String) -> Result<String, String> {
    let output = Command::new("yt-dlp")
        .arg("-g")
        .arg("-f")
        .arg("bestaudio")
        .arg("--no-playlist")
        .arg(url)
        .output()
        .expect("failed to execute process");

    let url = String::from_utf8(output.stdout).unwrap();
    Ok(url)
}

//command to get the link of the best audio quality of a soundcloud song
#[tauri::command]
fn getsoundcloud(url: String) -> Result<String, String> {
    let output = Command::new("yt-dlp")
        .arg("-f")
        .arg("mp3")
        .arg("-g")
        .arg(url)
        .output()
        .expect("failed to execute process");

    let url = String::from_utf8(output.stdout).unwrap();
    Ok(url)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load, save, getm3u8, getsoundcloud])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
