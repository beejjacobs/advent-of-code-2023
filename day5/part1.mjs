import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
    const content = await fs.readFile(path.join(__dirname, 'day5.txt'));
    const lines = content.toString()
        .split('\n')
        .map(l => l.trim());
    console.log(lines.length);
    
    const info = parseLines(lines);
    const locations = computeLocations(info);
    console.log(Math.min(...locations));
}

/**
 * @param {Info} info
 * @return {number[]}
 */
function computeLocations(info) {
    const locations = [];
    const values = [];
    for (const seed of info.seeds) {
        let m = `${seed}`;
        let value = seed;
        for (const maps of info.maps) {
            for (const {dest, source, range} of maps) {
                if (value < source) {
                    continue;
                }
                const diff = value - source;
                if (diff <= range) {
                    value = dest + diff;
                    break;
                }
            }
            m += `->${value}`;
        }
        values.push(m);
        locations.push(value);
    }
    // console.log(values);
    return locations;
}

/**
 * @typedef {Object} RangeMap
 * @property {number} source
 * @property {number} dest
 * @property {number} range
 */

/**
 * @typedef {Object<string, RangeMap[]>} RangeMaps
 */

/**
 * @typedef {Object} Info
 * @property {number[]} seeds
 * @property {RangeMap[][]} maps
 */


/**
 * @param {string[]} lines
 * @returns {Info}
 */
function parseLines(lines) {
    const seeds = lines.shift()
        .replace('seeds: ', '')
        .split(' ')
        .map(n => parseInt(n.trim()));

    const rangeMaps = [];

    let id = null;
    let maps = [];

    for (const line of lines) {
        if (line === '') {
            if (id) {
                rangeMaps.push(maps);
                id = null;
                maps = [];
            }
        } else if (line.includes('-to-')) {
            id = line.split(' ')[0];
        } else {
            const [dest, source, range] = line
                .split(' ')
                .map(num => parseInt(num));
            maps.push({
                dest, 
                source,
                range
            });
        }
    }
    if (id) {
        rangeMaps.push(maps);
    }

    return {seeds, maps: rangeMaps};
}

run().catch(console.error);