import fs from 'fs/promises';

async function run() {
    const content = await fs.readFile('day5.txt');
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
    // const values = [];
    for (const {start, length} of info.seeds) {
        for (let seed = start; seed < start + length; seed++) {
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
            console.log(value);
            locations.push(value);
        }
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
 * @typedef {Object} Info
 * @property {{start: number, length: number}[]} seeds
 * @property {RangeMap[][]} maps
 */


/**
 * @param {string[]} lines
 * @returns {Info}
 */
function parseLines(lines) {
    const seedValues = lines.shift()
        .replace('seeds: ', '')
        .split(' ')
        .map(n => parseInt(n.trim()));

    const seeds = [];
    for (let i = 0; i < seedValues.length; i+=2) {
        const start = seedValues[i];
        const length = seedValues[i + 1];
        seeds.push({start, length});
    }

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