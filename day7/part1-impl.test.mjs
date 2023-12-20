import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import { computeWinnings, parseAndRank } from './part1-impl.mjs';

describe('day7 part 1', () => {
    test('test input', () => {
        const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
        const lowest = computeWinnings(input);
        assert.equal(lowest, 6440);
    });

    test ('rankHands', () => {
        const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
        const got = parseAndRank(input);
        assert.deepEqual(got, [
            '32T3K',
            'KTJJT',
            'KK677',
            'T55J5',
            'QQQJA'
        ]);
    });
});