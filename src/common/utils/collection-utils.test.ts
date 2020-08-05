import {first} from "./collections-utils";

describe('collection-utils: first', function () {
    test('it should return first element of an array', function () {
        // setup
        const a = [1, 2, 3, 4, 5];

        // act
        const res = first(a);

        // verify
        expect(res).toBe(1)
    })

    test.each`
    input
    ${[]}
    ${null}
    ${undefined}
    `('it should return undefined if array is $input ', function (input) {
        // setup
        const res = first(input);

        // verify
        expect(res == null).toBeTruthy();
    })
})

