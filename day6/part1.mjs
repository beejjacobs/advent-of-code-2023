import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeWays, product } from './part1-impl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
    const content = await fs.readFile(path.join(__dirname, 'day6.txt'));
    const ways = computeWays(content.toString());

    console.log(product(ways));
}

run().catch(console.error);