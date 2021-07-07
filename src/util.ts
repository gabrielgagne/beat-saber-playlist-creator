import { existsSync, readFileSync, writeFileSync } from 'fs';

export const throttle = (ms: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  })
}


export const getCache = <T extends {}>(path: string): T => {
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  return {} as unknown as T;
}

export const writeCache = (path: string, data: any): void => {
  writeFileSync(path, JSON.stringify(data, null, 4), { flag: 'w' });
}