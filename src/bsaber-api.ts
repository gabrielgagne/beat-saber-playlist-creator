import axios from 'axios';
import { createBrotliDecompress } from 'zlib';

export interface IBSaberResponse {
  id: string,
  versions: {
    hash: string;
  }[],
}

export const getMap = async (songId: string): Promise<IBSaberResponse> => {
  // tslint:disable-next-line
  console.log(`calling ${songId} at ${new Date().getSeconds()}`);
  const map = (await axios({
    method: 'GET',
    url: `https://beatsaver.com/api/maps/id/${songId}`,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",

      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
    },
    decompress: true,
   // responseType: 'stream',
  })).data as IBSaberResponse;

  return map;
}