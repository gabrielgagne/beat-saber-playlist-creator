
import { join } from 'path';
import { getDifficultyString, mapDifficulties, mapFromFilePaths } from './beat-saber-files';
import { config } from './config';
import { getArtistsByTrackIds } from './load-artist-id';
import { getGenresByTracks } from './load-genres';
import { saveMapsToPlaylist } from './to-playlist';
import { getCache, writeCache } from './util';
import { getAllFilesInDir } from './walk';


const notFoundFilePath = join('./', 'not_found.json');

const notFoundFile = getCache(notFoundFilePath) as Record<string, {}>;
(async () => {

   const mapPaths = await getAllFilesInDir(config.songsPath, 'info.dat');
   const mapsDic = await mapFromFilePaths(mapPaths);
   const artistByTrackId = await getArtistsByTrackIds(Object.values(mapsDic));
   const genresByTracks = await getGenresByTracks(artistByTrackId);
   const tracksByGenre = Object.entries(genresByTracks).reduce((acc, [track, genres]) => {
      if (genres.length === 0) {
         acc['non-categorized'].push(track)
      }

      genres.forEach((g) => {
         if (!acc[g]) {
            acc[g] = []
         }

         acc[g].push(track);
      });
      return acc;
   }, {
      'non-categorized': [],
   } as Record<string, string[]>);


   /* Save list of no genres maps */
   Object.entries(genresByTracks).filter(([t, g]) => !g.length).forEach(([t]) => {
      notFoundFile[t] = {
         id: t,
         _songName: mapsDic[t]._songName,
         _songAuthorName: mapsDic[t]._songAuthorName,
         genres: [],
      };
   });
   writeCache(notFoundFilePath, notFoundFile);



   /* Create genre playlist */
   Object.entries(tracksByGenre).map(([g, tracksId]) => {
      return {
         name: g,
         songs: tracksId
            .filter(i => mapsDic[i])
            .map(i => mapsDic[i])
      }
   }).forEach((p) => {
      saveMapsToPlaylist(p.songs, p.name, 'critik2', config.playlistPath, '1-')
   });

   /* Create difficulty playlist */
   mapDifficulties.map((d) => {
      return {
         name: d,
         songs: Object.values(mapsDic).filter(m => m._difficultyBeatmapSets[0]._difficultyBeatmaps.find(s => s._difficulty === getDifficultyString(d))),
      }
   }).forEach((p) => {
      saveMapsToPlaylist(p.songs, p.name, 'critik2', config.playlistPath, '2-')
   })

})()

