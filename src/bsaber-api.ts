import axios from 'axios';
import { createBrotliDecompress } from 'zlib';

export interface IBSaberResponse {
  _id: string,
  hash: string,
  key: string,
  stats:{
    downloads: number,
    plays: number,
    downVotes: number,
    upVotes: number,
    heat: number,
    rating: number
  }
}

export const getMap = async (songId: string): Promise<IBSaberResponse> => {
  let resolveDecompress: Function;
  let rejectDecompress: Function;
  const promise: Promise<IBSaberResponse> = new Promise(async (resolve, reject) => {
    resolveDecompress = resolve;
    rejectDecompress = reject;
  })
  // tslint:disable-next-line
  console.log(`calling ${songId} at ${new Date().getSeconds()}`);
  await axios({
    method: 'GET',
    url: `https://beatsaver.com/api/stats/key/${songId}`,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",

      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
    },
    decompress: false,
    responseType: 'stream',
    transformResponse(data) {
      const brDecompress = createBrotliDecompress();
      brDecompress.on('error', () => {
        rejectDecompress();
      });
      brDecompress.on('data', (data) => {
        try {
          resolveDecompress(JSON.parse(Buffer.from(data).toString('utf8')))
        } catch (error) {
          rejectDecompress(data);
        }
      })
      return data.pipe(brDecompress)
    }
  })

  return promise;
}