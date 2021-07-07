import { join } from 'path';
import { ARTIST_NOT_FOUND, getArtistGenres } from './spotify-api';
import { getCache, throttle, writeCache } from './util';


export const genres = [
  "acoustic",
  "alternative",
  "anime",
  "children|kids",
  "chill",
  "classical",
  "comedy",
  "dance",
  "disco",
  "disney",
  "dubstep",
  "edm",
  "electro",
  "emo",
  "grindcore",
  "groove",
  "grunge",
  "hip-hop",
  "house",
  "indie",
  "j-pop|j-rock",
  "k-rock",
  "jazz",
  "latin",
  "metal",
  "movies",
  "pop",
  "punk",
  "reggae",
  "road-trip",
  "rock",
  "ska",
  "soundtracks",
  "techno"
]


const bySongCacheFilePath = join('./', 'genre_by_song.json');
const byArtistCacheFilePath = join('./', 'genre_by_artist.json');
const manualSongGenreFilePath = join('./', 'manual_song_genre.json');
const byArtistCacheFile = getCache(byArtistCacheFilePath) as Record<string, string[]>;
const bySongCacheFile = getCache(bySongCacheFilePath) as Record<string, string[]>;
const manualSongGenreFile = getCache(manualSongGenreFilePath) as Record<string, { genres?: string[] }>;

const getMatchingGenres = (rawGenres: string[]): string[] => {
  return genres.filter((g) => {
    if (g === 'j-pop|j-rock') {
      return rawGenres.some((rg) => {
        return rg.includes('j-pop') || g.includes('j-rock')
      })
    }

    return rawGenres.some((rg) => {
      return rg.includes(g) || g.includes(rg)
    })
  })
}

const putInCache = async (trackId: string, artistId: string): Promise<boolean> => {
  if (manualSongGenreFile[trackId]) {
    bySongCacheFile[trackId] = manualSongGenreFile[trackId].genres || [];
    return true;
  }

  if (byArtistCacheFile[artistId]) {
    bySongCacheFile[trackId] = byArtistCacheFile[artistId];
    return true;
  }

  if (artistId === ARTIST_NOT_FOUND) {
    bySongCacheFile[trackId] = [];
    return true;
  }

  const genres = await getArtistGenres(artistId);
  byArtistCacheFile[artistId] = getMatchingGenres(genres);
  bySongCacheFile[trackId] = byArtistCacheFile[artistId];
  return false;

}



export const getGenresByTracks = async (artistByTrack: Record<string, string>): Promise<Record<string, string[]>> => {

  const entries = Object.entries(artistByTrack);
  try {
    for (let i = 0; i < entries.length - 1; i++) {
      if (!await putInCache(entries[i][0], entries[i][1])) {
        await throttle(1500);
      }
    }
  } finally {
    writeCache(byArtistCacheFilePath, byArtistCacheFile);
    writeCache(bySongCacheFilePath, bySongCacheFile);
  }

  return bySongCacheFile;
}