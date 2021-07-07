# beat-saber-playlist-creator

Automatically creates genres and difficulty playlists. Genres ares fetch from the spotify api and are tied to artists.

On the first run, it'll try to find the artist by the exact song, if not found, on the second time it'll try to match the artist (can be problematic with features and collabs)

At any point, you can fill manual_song_genre to override / specify un matched song.

Use this format: 

Where the key is the song id, and the value is an object that MUST contain 'id' and 'genres'


```
{
  "21": {
    "id": "21",
    "_songName": "LUVORATORRRRRY!",
    "_songAuthorName": "feat.nqrse",
    "genres": [
      "anime",
      "electro",
      "techno"
    ]
  },
  "191": {
    "id": "191",
    "_songName": "Escape From The City",
    "_songAuthorName": "Sonic Adventure 2 Battle",
    "genres": [
      "soundtracks",
      "rock"
    ]
  },
}
```

After a run, you can use not_found.json to fill out your manual_song_genre.json

# Setup

npm ci

fill 'TO_FILL' fields in src/config.json

# Run

npm start
