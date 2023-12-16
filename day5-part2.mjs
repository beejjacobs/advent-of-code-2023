import fs from 'fs/promises';

async function run() {
    //const content = await fs.readFile('day5.txt');
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
    const lines = input // content.toString()
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
    let ranges = info.seedRanges;
    for (const maps of info.maps) {
        let mappedRanges = [];
        for (const range of ranges) { 
            for (const {sourceRange, inc} of maps) {
                const {in_, out} = rangeIntersection(sourceRange, range);
                for (const [start, end] of in_) {
                    mappedRanges.push([start + inc, end]);
                }

                // todo: handle out (and make it all actually work)
            }
        }
        ranges = mappedRanges;
    }
    return ranges.map(r => r[0]); // start of each range
}

/**
 * @typedef {Object} RangeMap
 * @property {number[]} sourceRange
 * @property {number} inc
 */

/**
 * @typedef {Object} Info
 * @property {number[][]} seedRanges 
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

    const seedRanges = [];
    for (let i = 0; i < seedValues.length; i+=2) {
        const start = seedValues[i];
        const length = seedValues[i + 1];
        seedRanges.push([start, start + length]);
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
                sourceRange: [source, source + range],
                inc: dest - source
            });
        }
    }
    if (id) {
        rangeMaps.push(maps);
    }

    return {seedRanges, maps: rangeMaps};
}

/**
 * @param {number[]} r1
 * @param {number[]} r2
 * @returns {{in_: number[][], out: number[][]}}
 */
function rangeIntersection(r1, r2) {
    const [r1Start, r1End] = r1;
    const [r2Start, r2End] = r2;
    // start in range, end out of range
    // r1 |-----------------|
    // r2          |--------------|
    if (inRange(r1, r2Start) && !inRange(r1, r2End)) {
        return {
            in_: [[r2Start, r1End]],
            out: [[r1End + 1, r2End]]
        };
    }
    // start out of range, end in range
    // r1          |--------------|
    // r2 |-----------------|
    if (!inRange(r1, r2Start) && inRange(r1, r2End)) {
        return {
            in_: [[r1Start, r2End]],
            out: [[r2Start, r1Start - 1]]
        };
    }
    // r2 within r1
    // r1 |--------------|
    // r2   |----------|
    if (r1Start < r2Start && r1End > r2End) {
        return {
            in_: [r2],
            out: []
        };
    }
    // r1 within r2
    // r1  |----------|
    // r2 |--------------| 
    if (r1Start < r2Start && r1End > r2End) {
        return {
            in_: [r1],
            out: [[r2Start, r1Start - 1], [r1End + 1, r2End]]
        };
    }
    return {
        in_: [],
        out: [r2]
    };
}

/**
 * @param {number[]} range
 * @param {number} num
 * @returns {boolean}
 */
function inRange([start, end], num) {
    return num <= end && num >= start;
}

run().catch(console.error);