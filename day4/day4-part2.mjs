import fs from 'fs/promises';

async function run() {
    const content = await fs.readFile('day4.txt');
    const lines = content.toString()
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    console.log(lines.length);

    const cards = lines
        .map(parseLine)
        .map(populateWinners);

    const counts = countCards(cards);

    const total = counts.reduce((total, v) => total += v, 0);
    console.log(total);
}

/**
 * @param {Card[]} cards
 * @return {number[]}
 */
function countCards(cards) {
    const instances = new Map();

    for (const card of cards) {
        instances.set(card.id, 1);
    }

    for (const card of cards) {
        const inc = instances.get(card.id);
        for (let i = 1; i <= card.winners; i++) {
            const id = card.id + i;
            instances.set(id, instances.get(id) + inc);            
        }
    }

    const counts = [...instances.values()];
    return counts;
}

/**
 * @typedef {Object} Card
 * @property {number} id
 * @property {number} winners
 * @property {number[]} winningNumbers
 * @property {number[]} inputNumbers
 */

/**
 * @param {Card} card
 * @returns {Card}
 */
function populateWinners(card) {
    card.winners = card.winningNumbers
        .filter(num => card.inputNumbers.includes(num))
        .length;
    return card;
}


/**
 * @param {string} line
 * @returns {Card}
 */
function parseLine(line) {
    const colonIndex = line.indexOf(':');
    const number = line.substring(0, colonIndex).replace('Card ', '');
    const id = parseInt(number);
    const [winning, input] = line.substring(colonIndex + 1).split('|');

    const winningNumbers = winning
        .split(' ')
        .filter(Boolean)
        .map(n => parseInt(n.trim()));
    const inputNumbers = input
        .split(' ')
        .filter(Boolean)
        .map(n => parseInt(n.trim()));

    return {id, winningNumbers, inputNumbers};
}

run().catch(console.error);