/**
 * @param {string} input 
 * @returns {number}
 */
export function computeWays(input) {
    const lines = input
        .split('\n')
        .map(l => l.trim());
    console.log(lines.length);

    const race = parseRace(lines);
    return waysCountForRace(race);
}

/**
 * 
 * @param {Race} race 
 * @returns {number}
 */
function waysCountForRace(race) {
    let firstWin = 0;

    for (let i = 1; i < race.time - 1; i++) {
        const speed = i;
        const time = race.time - speed;
        const distance = speed * time;
        if (distance > race.distance) {
            firstWin = i;
            break;
        }
    }

    return race.time - ((firstWin - 1) * 2) - 1;
}

/**
 * @typedef {Object} Race
 * @property {number} time
 * @property {number} distance
 */

/**
 * 
 * @param {string[]} lines
 * @return {Race} 
 */
function parseRace(lines) {
    const timeLine = lines.find(l => l.startsWith('Time: '));
    if (!timeLine) {
        throw new Error('no time input');
    }
    const distanceLine = lines.find(l => l.startsWith('Distance: '));
    if (!distanceLine) {
        throw new Error('no distance input');
    }
    const time = timeLine
        .replace('Time: ', '')
        .split(' ')
        .map(v => v.trim())
        .filter(Boolean)
        .reduce((str, v) => str += v, '');
    const distance = distanceLine
        .replace('Distance: ', '')
        .split(' ')
        .map(v => v.trim())
        .filter(Boolean)
        .reduce((str, v) => str += v, '');

    return {
        time: parseInt(time),
        distance: parseInt(distance)
    };
}