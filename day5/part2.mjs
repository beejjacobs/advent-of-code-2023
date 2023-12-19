import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeLowestLocation } from './part2-impl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
    const content = await fs.readFile(path.join(__dirname, 'day5.txt'));
    computeLowestLocation(content.toString());
}

run().catch(console.error);