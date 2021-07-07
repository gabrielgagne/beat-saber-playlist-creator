import { writeFileSync } from 'fs';
import { join } from 'path';
import { IAugmentedMap } from './beat-saber-files';
const toi = require('text-to-image')

export const saveMapsToPlaylist = (maps: IAugmentedMap[], name: string, author: string, savePath: string, filePrefix = '') => {
  const imageBase64 =  toi.generateSync(name, {
    bgColor: '#000000',
    textColor: '#FFFFFF',
    customHeight: 1024,
    maxWidth: 1024,
    fontFamily: 'Fira Code',
    fontPath: join('./', 'FiraCode-Regular.ttf'),
    fontSize: Math.ceil(1300 / name.length),
    verticalAlign: 'center',
    textAlign: 'center'
   }).replace('data:image/png;base64,', 'base64,');

  const playlistContent = {
    playlistTitle: `${filePrefix}${name}`,
    playlistAuthor: author,
    songs: maps.map(m => ({
      songName: m._songName,
      levelAuthorName: m._songAuthorName,
      hash: m.hash,
      levelid: `custom_level_${ m.hash }`
    })),
    image: imageBase64,
  }

  writeFileSync(join(savePath, filePrefix+name.replace('|', '-')+'.bplist'), JSON.stringify(playlistContent, null, 4), { flag: 'w' });
}