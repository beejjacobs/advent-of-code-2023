import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeWays } from './part2-impl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
    const content = await fs.readFile(path.join(__dirname, 'day6.txt'));
    const ways = computeWays(content.toString());

    console.log(ways);
}

run().catch(console.error);