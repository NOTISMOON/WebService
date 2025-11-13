import { createHash } from "crypto";
import { createReadStream } from "fs";

export async function calculateHashAsync(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha1');
    const readStream = createReadStream(filePath);
    
    readStream.on('data', (chunk) => hash.update(chunk));
    readStream.on('end', () => resolve(hash.digest('hex')));
    readStream.on('error', (err) => reject(err));
  });
}