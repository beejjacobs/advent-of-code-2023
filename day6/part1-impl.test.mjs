import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import { computeWays } from './part1-impl.mjs';

describe('day6 part1', () => {
    describe('computeWays', () => {
        test('example input', () => {
            const input = `Time:      7  15   30\nDistance:  9  40  200`; 
            const got = computeWays(input);
            assert.deepEqual(got, [4, 8, 9])
        });
    })
});

