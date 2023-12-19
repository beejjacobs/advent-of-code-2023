import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
    const content = await fs.readFile(path.join(__dirname, 'day2.txt'));
    const lines = content.toString()
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    console.log(lines.length);

    const values = lines
        .map(removeGameSuffix)
        .map(powerOfSets);

    const total = values.reduce((total, v) => total += v, 0);
    console.log(total);
}

/**
 * @typedef {Object} Info
 * @property {number} id
 * @property {string} line
 */
/**
 *
 * @param {string} line
 * @returns {number}
 */
function powerOfSets(line) {
    const sets = line.split(';');

    const min = {
        red: 0,
        green: 0,
        blue: 0
    };

    for (const set of sets) {
        const parts = set.split(',').map(p => p.trim());
        for (const part of parts) {
            const [num, colour] = part.split(' ');
            const qty = parseInt(num);
            if (qty > min[colour]) {
                min[colour] = qty;
            }
        }
    }
    return min.red * min.green * min.blue;
}

/**
 * @param {string} line
 * @returns {string}
 */
function removeGameSuffix(line) {
    const colonIndex = line.indexOf(':');
    return line.substring(colonIndex + 1);
}

run().catch(console.error);