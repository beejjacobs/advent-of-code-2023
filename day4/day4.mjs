import fs from 'fs/promises';

async function run() {
    const content = await fs.readFile('day4.txt');
    const lines = content.toString()
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    console.log(lines.length);

    const values = lines
        .map(parseLine)
        .map(score);

    const total = values.reduce((total, v) => total += v, 0);
    console.log(total);
}

/**
 * @typedef {Object} Numbers
 * @property {number[]} winningNumbers
 * @property {number[]} inputNumbers
 */

/**
 * @param {Numbers} Numbers
 * @returns {number}
 */
function score({winningNumbers, inputNumbers}) {
    const winners = winningNumbers
        .filter(num => inputNumbers.includes(num))
        .length;
    if (winners === 0) {
        return 0;
    }
    return 2 ** (winners - 1);
}


/**
 * @param {string} line
 * @returns {Numbers}
 */
function parseLine(line) {
    const colonIndex = line.indexOf(':');
    const [winning, input] = line.substring(colonIndex + 1).split('|');

    const winningNumbers = winning
        .split(' ')
        .filter(Boolean)
        .map(n => parseInt(n.trim()));
    const inputNumbers = input
        .split(' ')
        .filter(Boolean)
        .map(n => parseInt(n.trim()));

    return {winningNumbers, inputNumbers};
}

run().catch(console.error);