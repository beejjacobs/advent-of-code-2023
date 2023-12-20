import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeWinnings } from './part1-impl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
    const content = await fs.readFile(path.join(__dirname, 'day7.txt'));
    const winnings = computeWinnings(content.toString());

    console.log(winnings);
}

run().catch(console.error);