import {describe, test} from 'node:test';
import { computeLowestLocation, inverseRanges, rangeIntersection } from './day5-part2-impl.mjs';
import assert from 'node:assert/strict';

describe('computeLowestLocation', () => {
    test('test input', () => {
        const input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
        const lowest = computeLowestLocation(input);
        assert.equal(lowest, 46);
    });

});

describe('rangeIntersection', () => {
    const tests = [
        {
            name: 'start in range',
            r1: [1, 10],
            r2: [5, 20],
            want: [5, 10]
        },
        {
            name: 'end in range',
            r1: [10, 20],
            r2: [5, 15],
            want: [10, 15]
        },
        {
            name: 'within r1',
            r1: [10, 20],
            r2: [12, 14],
            want: [12, 14]
        },
        {
            name: 'within r2',
            r1: [10, 20],
            r2: [8, 25],
            want: [10, 20]
        },
        {
            name: 'no intersection',
            r1: [10, 20],
            r2: [30, 40],
            want: null
        },
        {
            name: 'test case 1',
            r1: [25, 95],
            r2: [81, 95],
            want: [81, 95]
        }
    ];

    for (const t of tests) {
        test(t.name, () => {
            const got = rangeIntersection(t.r1, t.r2);
            assert.deepEqual(got, t.want);
        });
    }
});

describe('inverseRanges', () => {
    const tests = [
        {
            name: 'nothing to remove',
            range: [1, 10],
            rangesToRemove: [],
            want: [[1, 10]]
        },
        {
            name: 'everything to remove',
            range: [1, 10],
            rangesToRemove: [[1, 10]],
            want: []
        },
        {
            name: 'from start',
            range: [1, 10],
            rangesToRemove: [[1, 5]],
            want: [[6, 10]]
        },
        {
            name: 'to end',
            range: [1, 10],
            rangesToRemove: [[6, 10]],
            want: [[1, 5]]
        },
        {
            name: 'multiple',
            range: [1, 10],
            rangesToRemove: [[2, 3], [5, 6], [7, 8]],
            want: [[1, 1], [4, 4], [9, 10]]
        },
        {
            name: 'multiple',
            range: [1, 10],
            rangesToRemove: [[1, 1], [5, 6], [7, 8]],
            want: [[2, 4], [9, 10]]
        },
        {
            name: 'out of order',
            range: [79, 218],
            rangesToRemove: [ [ 98, 99 ], [ 79, 97 ] ],
            want: [[100, 218]]
        }
    ];

    for (const t of tests) {
        test(t.name, () => {
            const got = inverseRanges(t.range, t.rangesToRemove);
            assert.deepEqual(got, t.want);
        });
    }
});