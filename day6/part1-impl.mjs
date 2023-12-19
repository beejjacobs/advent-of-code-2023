/**
 * @param {string} input 
 * @returns {number[]}
 */
export function computeWays(input) {
    const lines = input
        .split('\n')
        .map(l => l.trim());
    console.log(lines.length);

    const races = parseRaces(lines);
    return races.map(waysCountForRace);
}

/**
 * @param {number[]} numbers 
 * @returns {number}
 */
export function product(numbers) {
    return numbers.reduce((total, x) => total * x, 1)
}

/**
 * 
 * @param {Race} race 
 * @returns {number}
 */
function waysCountForRace(race) {
    let ways = 0;

    for (let i = 1; i < race.time - 1; i++) {
        const speed = i;
        const time = race.time - speed;
        const distance = speed * time;
        if (distance > race.distance) {
            ways++;
        }
    }

    return ways;
}

/**
 * @typedef {Object} Race
 * @property {number} time
 * @property {number} distance
 */

/**
 * 
 * @param {string[]} lines
 * @return {Race[]} 
 */
function parseRaces(lines) {
    const timeLine = lines.find(l => l.startsWith('Time: '));
    if (!timeLine) {
        throw new Error('no time input');
    }
    const distanceLine = lines.find(l => l.startsWith('Distance: '));
    if (!distanceLine) {
        throw new Error('no distance input');
    }
    const times = timeLine
        .replace('Time: ', '')
        .split(' ')
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => parseInt(v));
    const distances = distanceLine
        .replace('Distance: ', '')
        .split(' ')
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => parseInt(v));

    return times.map((time, i) => {
        return {
            time,
            distance: distances[i]
        };
    });
}