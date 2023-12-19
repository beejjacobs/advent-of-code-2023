import fs from 'fs/promises';
import { computeLowestLocation } from './day5-part2-impl.mjs';

async function run() {
    const content = await fs.readFile('day5.txt');
    computeLowestLocation(content.toString());
}

run().catch(console.error);