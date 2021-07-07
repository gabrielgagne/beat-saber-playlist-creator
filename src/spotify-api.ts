import axios from 'axios';
import { resolveProjectReferencePath } from 'typescript';
import { IAugmentedMap } from './beat-saber-files';
import { config } from './config';
import { getCache, writeCache } from './util';

export interface ISpotifyResponse {

}

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": `Bearer ${config.spotifyToken}`
};

const simplifySearchTerm = (term: string): string => {
  return term
    .replace(/ *\([^)]*\) */g, " ")
    .replace('[BT90]', '')
    .split('ft.')[0]
    .split('feat.')[0]
    .split('+ ')[0];
}

export const ARTIST_NOT_FOUND = 'ARTIST_NOT_FOUND';
export const artistIdSearch = async (track: IAugmentedMap, wasNotFound = false): Promise<string> => {
  let searchTerm = `${ track._songName } ${ track._songAuthorName }`;
  let simplifiedTerm = wasNotFound ? simplifySearchTerm(track._songAuthorName) : '';
  console.log(`calling for artist id of track ${ searchTerm } ${ wasNotFound ? '||| SIMPLIFIED ' + simplifiedTerm : '' } at ${ new Date().getSeconds() }`);
  if(( wasNotFound ? simplifiedTerm : searchTerm) === '') {
    return 'ARTIST_NOT_FOUND';
  }
  const res = await axios({
    method: 'GET',
    url: `https://api.spotify.com/v1/search`,
    params: {
      'q': wasNotFound ? simplifiedTerm : searchTerm,
      'type': wasNotFound ? 'artist' : 'track',
    },
    headers
  });

  if (res?.data?.tracks?.items?.length) {
    return res?.data?.tracks?.items[0].artists[0].id;
  }
  if (res?.data?.artists?.items?.length) {
    return res?.data?.artists?.items[0].id;
  }

  return 'ARTIST_NOT_FOUND';
}


export const getArtistGenres = async (id: string): Promise<string[]> => {
  const res = await axios({
    method: 'GET',
    url: `https://api.spotify.com/v1/artists/${id}`,
    headers
  });

  return res.data.genres;
}
