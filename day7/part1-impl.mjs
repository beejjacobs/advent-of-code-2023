/**
 * @param {string} input 
 * @returns {number}
 */
export function computeWinnings(input) {
    const lines = input
        .split('\n')
        .map(l => l.trim());
    console.log(lines.length);

    const hands = parseHands(lines);
    populateTypes(hands);
    rankHands(hands);

    let winnings = 0;
    for (let i = 0; i < hands.length; i++) {
        const hand = hands[i];
        winnings += hand.bid * (i + 1);
    }
    return winnings;
}

/**
 * @param {string} input 
 * @returns {string[]}
 */
export function parseAndRank(input) {
    const lines = input
        .split('\n')
        .map(l => l.trim());
    console.log(lines.length);

    const hands = parseHands(lines);
    populateTypes(hands);
    rankHands(hands);
    return hands.map(h => h.cards);
}

/**
 * 
 * @param {Hand[]} hands 
 * @returns {Hand[]}
 */
export function rankHands(hands) {
    hands.sort(sortHandsByRank)
    return hands;
}

/**
 * @param {Hand} a 
 * @param {Hand} b 
 * @returns {number}
 */
function sortHandsByRank(a, b) {
    if (a.type > b.type) {
        return 1;
    }
    if (a.type < b.type) {
        return -1;
    }
    for (let i = 0; i < a.cards.length; i++) {
        const aCard = cardRank.indexOf(a.cards[i]);
        const bCard = cardRank.indexOf(b.cards[i]);
        if (aCard > bCard) {
            return 1;
        }
        if (aCard < bCard) {
            return -1;
        }
    }
    return 0;
}

const cardRank = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();

/**
 * @typedef {Object} Hand
 * @property {string} cards
 * @property {number} bid
 * @property {number} type
 * @property {CardCounts} counts
 */

/**
 * @param {Hand[]} hands 
 * @returns {Hand[]}
 */
function populateTypes(hands) {
    return hands.map(h => {
        h.type = handType(h);
        return h;
    });
}

/**
 * @param {Hand} hand
 * @returns {number}
 */
function handType(hand) {
    // XXXXX
    if (hasDistinctCards(hand, 1)) {
        return RANKS.FIVE_OF_A_KIND;
    }
    
    if (hasDistinctCards(hand, 2)) {
        // XXXXY
        if (handHasCount(hand, 1)) {
            return RANKS.FOUR_OF_A_KIND;
        }
        // XXXYY
        if (handHasCount(hand, 2)) {
            return RANKS.FULL_HOUSE;
        }
    }
    // XXXYZ
    if (hasDistinctCards(hand, 3) && handHasCount(hand, 3)) {
        return RANKS.THREE_OF_A_KIND;
    }
    // XXYYZ
    if (hasDistinctCards(hand, 3) && handHasCountInstances(hand, 2, 2)) {
        return RANKS.TWO_PAIR;
    }
    // XXYZA
    if (hasDistinctCards(hand, 4) && handHasCount(hand, 2)) {
        return RANKS.ONE_PAIR;
    }
    // XYZAB
    if (hasDistinctCards(hand, 5)) {
        return RANKS.HIGH_CARD;
    }
    return 0;
}

/**
 * @param {Hand} hand 
 * @param {number} count 
 * @param {number} instances 
 * @returns {boolean}
 */
function handHasCountInstances(hand, count, instances) {
    return Object.entries(hand.counts).filter(([k, v]) => v === count).length === instances;
}

/**
 * @param {Hand} hand 
 * @param {number} count 
 * @returns {boolean}
 */
function handHasCount(hand, count) {
    return Object.entries(hand.counts).some(([k, v]) => v === count);
}

/**
 * @param {Hand} hand 
 * @param {number} counts
 * @returns {boolean}
 */
function hasDistinctCards(hand, counts) {
    return Object.keys(hand.counts).length === counts;
}

const RANKS = {
    FIVE_OF_A_KIND: 7,
    FOUR_OF_A_KIND: 6,
    FULL_HOUSE: 5,
    THREE_OF_A_KIND: 4,
    TWO_PAIR: 3,
    ONE_PAIR: 2,
    HIGH_CARD: 1
};

/**
 * 
 * @param {string[]} lines
 * @return {Hand[]} 
 */
function parseHands(lines) {
    return lines.map(l => {
        const parts = l.split(' ').filter(Boolean);
        if (parts.length !== 2) {
            throw new Error(`unexpected line: ${l}`);
        }
        const bid = parseInt(parts[1]);
        if (isNaN(bid)) {
            throw new Error(`unexpected bid: ${l} (${parts[1]})`);
        }
        const cards = parts[0];
        return {
            cards,
            bid,
            type: 0,
            counts: cardCounts(cards)
        };
    });
}

/**
 * @typedef {Object<string, number>} CardCounts
 */

/**
 * 
 * @param {string} hand 
 * @returns {CardCounts}
 */
function cardCounts(hand) {
    /** @type {CardCounts} */
    const counts = {};
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        counts[card] = (counts[card] || 0) + 1;
    }
    return counts;
}