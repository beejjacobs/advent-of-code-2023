import fs from 'fs/promises';

async function run() {
    const content = await fs.readFile('day3.txt');
    const lines = content.toString()
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    console.log(lines.length);

    const values = partNumbers(lines);

    const total = values.reduce((total, v) => total += v, 0);
    console.log(total);
}

/**
 * @typedef {Object} NumberValue
 * @property {string} id
 * @property {number} value
 */


/**
 *
 * @param {string[]} lines
 * @returns {number[]}
 */
function partNumbers(lines) {
    /** @type {Map<string, NumberValue>} */
    const numberPositions = new Map();

	// find all numbers
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
		let num = '';
		let inNum = false;
		/** @type {string[]} */
		let positions = [];
		function addNumber() {
			const number = {
				id: positions[0],
				value: parseInt(num)
			};
			for (const position of positions) {
				numberPositions.set(position, number);
			}
			inNum = false;
			positions = [];
			num = '';
		}
        for (let x = 0; x < line.length; x++) {
            const char = line[x];
            if (isDigit(char)) {
				positions.push(positionId(x, y));
				if (inNum) {
					num += char;
				} else { // first digit
					inNum = true;
					num = char;
				}
            } else {
				if (!inNum) {
					continue;
				}
				addNumber();
			}
        }
		if (inNum) { // still in number at end of line
			addNumber();
		}
    }

	// find all symbols
	const symbols = findSymbols(lines);
	const positionsAdjacentToSymbols = new Set();
	for (const [x, y] of symbols) {
		positionsAroundSymbol(lines, x, y, positionsAdjacentToSymbols);
	}

    return numbersToCount(numberPositions, positionsAdjacentToSymbols);
}

/**
 * @param {string[]} lines
 * @returns {{x: number, y: number}[]}
 */
function findSymbols(lines) {
	const symbols = [];
	for (let y = 0; y < lines.length; y++) {
		const line = lines[y];
		for (let x = 0; x < line.length; x++) {
			const char = line[x];
			if (isDigit(char) || char === '.') {
				continue;
			}
			symbols.push([x, y]);
		}
	}
	return symbols;
}

/**
 * @param {Map<string, NumberValue>} numberPositions
 * @param {Set<string>} positionsAdjacentToSymbols
 * @returns {number[]}
 */
function numbersToCount(numberPositions, positionsAdjacentToSymbols) {
	const numbersToCount = new Map();
	for (const position of positionsAdjacentToSymbols) {
		if (numberPositions.has(position)) {
			const num = numberPositions.get(position);
			numbersToCount.set(num.id, num.value);
		}
	}

	return [...numbersToCount.values()];
}

/**
 *
 * @param {string[]} lines
 * @param {number} cX
 * @param {number} cY
 * @param {Set<string>} positionsAdjacentToSymbols
 */
function positionsAroundSymbol(lines, cX, cY, positionsAdjacentToSymbols) {
    const lineLength = lines[0].length;
    for (let dX = -1; dX <= 1; dX++) {
        for (let dY = -1; dY <= 1; dY++) {
            const x = cX + dX;
            const y = cY + dY;
            if (y < 0 || y > lines.length) {
                continue;
            }
            if (x < 0 || x > lineLength) {
                continue;
            }
            positionsAdjacentToSymbols.add(positionId(x, y));
        }
    }
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
function positionId(x, y) {
	return `${x}x${y}y`;
}

const charCodeZero = "0".charCodeAt(0);
const charCodeNine = "9".charCodeAt(0);

/**
 *
 * @param {string|number} n
 * @returns {boolean}
 */
function isDigit(n) {
	if (typeof n === 'string') {
		n = n.charCodeAt(0);
	}
    return (n >= charCodeZero && n <= charCodeNine);
}


run().catch(console.error);