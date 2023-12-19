import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import { computeWays } from './part2-impl.mjs';

describe('day6 part2', () => {
    describe('computeWays', () => {
        test('example input', () => {
            const input = `Time:      7  15   30\nDistance:  9  40  200`; 
            const got = computeWays(input);
            assert.deepEqual(got, 71503)
        });
    })
});

