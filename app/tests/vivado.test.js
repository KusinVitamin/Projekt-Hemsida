var x = require("../src/vivado");

describe("sum()", () => {
    it("adds 1 + 2 to equal 3", () => {
        expect(x.sum(1, 2)).toBe(3);
    });
    it("adds 2 + 1 to equal 3", () => {
        expect(x.sum(2, 1)).toBe(3);
    });
});

describe("LogParser()", () => {
    it("Should output two errors", () => {
        const errors = x.logParser("./public/simulate.log");
        const expected = ["V error", "C error"];
        expect(errors).toEqual(expected);
    });
});
