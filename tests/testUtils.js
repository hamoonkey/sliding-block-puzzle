
export function expectEqual(expect, actual) {
    console.assert(expect === actual, `expect: ${expect}, actual: ${actual}`);
}
export function expectNotEqual(expect, actual) {
    console.assert(expect !== actual, `expect: not ${expect}, actual: ${actual}`);
}
export function expectEqualArray(expect, actual) {
    expectEqual(expect.length, actual.length);
    for (let i = 0; i < expect.length; i++) {
        expectEqual(expect[i], actual[i]);
    }
}