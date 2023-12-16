const input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

// import fs from 'fs/promises';

async function run() {
    //const content = await fs.readFile('day4.txt');
    const lines = input
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