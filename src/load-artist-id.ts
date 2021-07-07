import { join } from 'path';
import { IAugmentedMap } from './beat-saber-files';
import { artistIdSearch, ARTIST_NOT_FOUND } from './spotify-api';
import { getCache, throttle, writeCache } from './util';

const cacheFilePath = join('./', 'artistId_cache.json');

const putInCache = async (map: IAugmentedMap, artistIdCache:Record<string, string>): Promise<boolean> => {
  const cacheValue = artistIdCache[map.id];
  if (!cacheValue /*|| cacheValue === ARTIST_NOT_FOUND*/) {
    const artistId = await artistIdSearch(map,  cacheValue === ARTIST_NOT_FOUND);
    artistIdCache[map.id] = artistId;
    return false;
  }
  return true;
}

export const getArtistsByTrackIds = async (maps: IAugmentedMap[]): Promise<Record<string, string>> => {
  const artistIdCache = <Record<string, string>>getCache(cacheFilePath);
  try {
    for (let i = 0; i < maps.length - 1; i++) {
      if (!await putInCache(maps[i], artistIdCache)) {
        await throttle(1000);
      }
    }
  } finally {
    writeCache(cacheFilePath, artistIdCache);
  }

  return artistIdCache;
}