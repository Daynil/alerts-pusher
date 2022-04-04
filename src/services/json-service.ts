import { readFile, writeFile } from 'fs/promises';

export async function parseJSONFile<T>(filePath: string): Promise<T> {
  const rawContents = await readFile(filePath);
  return JSON.parse(rawContents.toString()) as T;
}

export async function writeJSONFile(filePath: string, data: any) {
  const jsonData = JSON.stringify(data);
  await writeFile(filePath, jsonData);
}
