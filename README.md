# Fungus Music App

Fungus is a music application built with Tauri, React, and TypeScript. It allows users to manage their music library, create playlists, and play songs with various features like shuffle, repeat, and volume control.
Online links are obtained using `yt-dlp`. If `yt-dlp` is not installed, online music playback will not be available.

#
> [!WARNING]
> The `playlists`, `settings`, and `songs` are saved in JSON format and stored in the "Documents" directory as **music-data**. Be careful not to delete them, as doing so will result in the loss of all data.

## Features

- Import songs from local files
- Create and manage playlists
- Search for songs and videos
- Play, pause, skip, and seek songs
- Shuffle and repeat functionality
- Volume control

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/JetShen/Fungus
    cd fungus
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Run the development server:
    ```sh
    npm run tauri dev
    ```

4. Build the application:
    ```sh
    npm run tauri build
    ```

## Configuration

The application configuration is managed through `tauri.conf.json`. You can customize various settings like build commands, package information, and security policies.

## Commands

- `load(filedir: String)`: Load music data from a specified file directory.
- `save(filedir: String, data: MusicAppData)`: Save music data to a specified file directory.
- `getm3u8(url: String)`: Get the m3u8 file URL using `yt-dlp`.
- `getsoundcloud(url: String)`: Get the best audio quality link of a SoundCloud song using `yt-dlp`.

## Components

- `Home`: Main component that loads and displays the music player.
- `MusicPlayer`: Component that handles the music player functionality.
- `SongList`: Component that displays the list of songs.
- `PlaylistSection`: Component that displays and manages playlists.
- `PlayerControls`: Component that provides controls for playing music.
- `SongItem`: Component that displays individual song items.

## Types

- `Song`: Represents a song with id, title, artist, and URL.
- `Playlist`: Represents a playlist with id, name, and song IDs.
- `MusicAppSettings`: Represents the settings of the music app.
- `MusicAppData`: Represents the entire music app data including songs, playlists, and settings.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements

- [Tauri v1](https://v1.tauri.app/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
