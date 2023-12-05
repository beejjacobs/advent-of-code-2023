import fs from 'fs/promises';

async function run() {
    const content = await fs.readFile('day1.txt');
    const lines = content.toString().split('\n');
    console.log(lines.length);

    const values = lines.map(calibrationValue);

    const total = values.reduce((total, v) => total += v, 0);
    console.log(total);
}

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/**
 * 
 * @param {string} line 
 * @returns {number}
 */
function calibrationValue(line) {
    let first = 0;
    let last = 0;
    for (let i = 0; i < line.length; i++) {
        const char = parseInt(line[i]);
        // is this a digit
        if (!isNaN(char)) {
            first = char;
            break;
        }
        // is it a word?
        const sub = line.substring(i);
        const digit = digits.find(d => sub.startsWith(d));
        if (digit) {
            first = digits.indexOf(digit) + 1;
            break;
        }
    }

    for (let i = line.length; i >= 0; i--) {
        const char = parseInt(line[i]);
        // is this a digit
        if (!isNaN(char)) {
            last = char;
            break;
        }

        // is it a word?
        const sub = line.substring(i);
        const digit = digits.find(d => sub.startsWith(d));
        if (digit) {
            last = digits.indexOf(digit) + 1;
            break;
        }
    }
    // console.log(line, first, last);
    return parseInt(`${first}${last}`);
}

run().catch(console.error);