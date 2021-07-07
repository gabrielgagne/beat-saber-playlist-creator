import { promises } from 'fs';
import { join } from 'path';


async function* walk(dir: string, extension: string): any {
  for await (const d of await promises.opendir(dir)) {
    const entry = join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry, extension);
    else if (d.isFile() && d.name.includes(extension)) yield entry;
  }
}

// Then, use it with a simple async for loop
export async function getAllFilesInDir(dir: string, extension: string): Promise<string[]> {
  const files = [] as any[]
  for await (const p of walk(dir, extension))
    files.push(p)
  
    return files;
}