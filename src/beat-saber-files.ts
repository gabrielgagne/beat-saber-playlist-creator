import { readFileSync } from 'fs';
import { join } from 'path';
import { getMap } from './bsaber-api';
import { getCache, throttle, writeCache } from './util';

export type MapDifficulty = 'Easy' | 'Standard' | 'Hard' | 'Expert' | 'ExpertPlus';
export interface IMap {
  _songName: string,
  _songAuthorName: string,
  _difficultyBeatmapSets: [
    {
      _beatmapCharacteristicName: string;
      _difficultyBeatmaps: [
        {
          _difficulty: MapDifficulty;
        }
      ]
    }
  ]
}

export interface IAugmentedMap extends IMap {
  id: string,
  hash: string,
  fromCache: boolean,
}
export const mapDifficulties: MapDifficulty[] = ['Easy', 'Standard', 'Hard', 'Expert', 'ExpertPlus']
export const getDifficultyString = (d: MapDifficulty): string => {
  return d === 'Standard' ? 'Normal' : d;
}


const cacheFilePath = join('./', 'song_hash_cache.json');


const putInCache = async (songId: string, hashCache: Record<string, string>): Promise<boolean> => {
  if (!hashCache[songId]) {
    const apiMap = await getMap(songId);
    hashCache[songId] = apiMap.hash
    return false;
  }
  return true;
}


export const mapFromFilePath = async (hashCache: Record<string, string>, filePath: string): Promise<IAugmentedMap> => {
  const baseMap = JSON.parse(readFileSync(filePath, 'utf8')) as IMap;
  const foldersInPath = filePath.split('\\');
  const songId = foldersInPath[foldersInPath.length - 2].split(' (')[0];
  const fromCache = await putInCache(songId, hashCache);
  return {
    ...baseMap,
    fromCache,
    id: songId,
    hash: hashCache[songId],
  } as IAugmentedMap
}


export const mapFromFilePaths = async (files: string[]): Promise<Record<string, IAugmentedMap>> => {
  const hashCache = getCache(cacheFilePath);
  const maps: IAugmentedMap[] = [];
  try {
    for (let i = 0; i < files.length - 1; i++) {
      const map = await mapFromFilePath(hashCache, files[i]);
      if (!map.fromCache) {
        await throttle(1500);
      }

      maps.push(map);
    }
  } finally {
    writeCache(cacheFilePath, hashCache);
  }

  return maps.reduce((all, m) => { all[m.id] = m; return all }, {} as Record<string, IAugmentedMap>);
}