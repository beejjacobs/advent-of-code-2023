import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
    red: 12,
    green: 13,
    blue: 14
};

async function run() {
    const content = await fs.readFile(path.join(__dirname, 'day2.txt'));
    const lines = content.toString()
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    console.log(lines.length);

    const values = lines
        .map(extractGamePrefix)
        .filter(info => isGamePossible(info, config))
        .map(info => info.id);

    const total = values.reduce((total, v) => total += v, 0);
    console.log(total);
}

/**
 * @typedef {Object} Info
 * @property {number} id
 * @property {string} line
 */

/**
 * @typedef {Object} Config
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 */

/**
 *
 * @param {Info} info
 * @param {Config} config
 * @returns {boolean}
 */
function isGamePossible({id, line}, config) {
    const sets = line.split(';');

    for (const set of sets) {
        const parts = set.split(',').map(p => p.trim());
        for (const part of parts) {
            const [num, colour] = part.split(' ');
            const qty = parseInt(num);
            if (qty > config[colour]) {
                return false;
            }
        }
    }
    return true;
}

/**
 * @param {string} line
 * @returns {Info}
 */
function extractGamePrefix(line) {
    const colonIndex = line.indexOf(':');
    const number = line.substring(0, colonIndex).replace('Game ', '');
    const id = parseInt(number);
    const remaining = line.substring(colonIndex + 1);
    return {id, line: remaining};
}

run().catch(console.error);