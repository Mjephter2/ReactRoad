describe('something true or false', () => {
    test('true to be true', () => {
        // expect(true).toBe(true);
        expect(true).toBeTruthy();
    })

    test('false to be false', () => {
        // expect(false).toBe(true);
        expect(false).toBeFalsy();
    })
})
