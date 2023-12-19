/**
 * @param {string} input 
 * @returns {number}
 */
export function computeLowestLocation(input) {
    const lines = input
        .split('\n')
        .map(l => l.trim());
    console.log(lines.length);
    
    const info = parseLines(lines);
    const locations = computeLocations(info);
    const loc = Math.min(...locations);
    console.log('Min Location', loc);
    return loc;
}

/**
 * @param {Info} info
 * @return {number[]}
 */
function computeLocations(info) {
    let ranges = info.seedRanges;
    // go through each mapping for each [seed] range
    for (const maps of info.maps) {
        // console.log(ranges, maps);
        const mappedRanges = [];
        for (const range of ranges) { 
            const rangesWithMappings = [];
            for (const {sourceRange, inc} of maps) {
                const inter = rangeIntersection(sourceRange, range);
                if (inter) {
                    // map to new range with +inc
                    mappedRanges.push([inter[0] + inc, inter[1] + inc]);
                    rangesWithMappings.push(inter);
                }
            }
            // now we have all ranges with mappings, compute the inverse ranges that have no mappings
            mappedRanges.push(...inverseRanges(range, rangesWithMappings));
        }
        ranges = mappedRanges;
    }
    // console.log(ranges);
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
 * Returns the range that intersects r1 and r2
 *
 * @param {number[]} r1
 * @param {number[]} r2
 * @returns {number[]|null}
 */
export function rangeIntersection(r1, r2) {
    const [r1Start, r1End] = r1;
    const [r2Start, r2End] = r2;
    // start in range, end out of range
    // r1 |-----------------|
    // r2          |--------------|
    if (inRange(r1, r2Start) && !inRange(r1, r2End)) {
        return [r2Start, r1End];
    }
    // start out of range, end in range
    // r1          |--------------|
    // r2 |-----------------|
    if (!inRange(r1, r2Start) && inRange(r1, r2End)) {
        return [r1Start, r2End];
    }
    // r2 within r1
    // r1 |--------------|
    // r2   |----------|
    if (inRange(r1, r2Start) && inRange(r1, r2End)) {
        return r2;
    }
    // r1 within r2
    // r1  |----------|
    // r2 |--------------| 
    if (inRange(r2, r1Start) && inRange(r2, r1End)) {
        return r1;
    }
    return null;
}

/**
 * 
 * @param {number[]} range 
 * @param {number[][]} rangesToRemove 
 * @returns {number[][]} 
 */
export function inverseRanges(range, rangesToRemove) {
    if (rangesToRemove.length === 0) {
        return [range];
    }
    // sort by start
    rangesToRemove.sort((a, b) => a[0] - b[0]);
    const inverse = [];
    let previous;
    for (let i = 0; i < rangesToRemove.length; i++) {
        const [start, end] = rangesToRemove[i];
        if (i === 0) { // first one
            if (start !== range[0]) {
                // |----------------------------|
                //           |--------------|
                // xxxxxxxxxx
                inverse.push([range[0], start - 1]);
            }
        } else {
            if (start !== (previous[1] + 1)) {
                // |----------------------------|
                //    |----|
                //              |-----|
                //          xxxx
                inverse.push([previous[1] + 1, start - 1]);
            }
        }
        if (i === rangesToRemove.length - 1) {
            if (end !== range[1]) {
                // |----------------------------|
                //    |----|
                //              |-----|
                //                     xxxxxxxxxx
                inverse.push([end + 1, range[1]]);
            }
        } 
        previous = [start, end];
    }
    return inverse;
}

/**
 * @param {number[]} range
 * @param {number} num
 * @returns {boolean}
 */
export function inRange([start, end], num) {
    return num <= end && num >= start;
}