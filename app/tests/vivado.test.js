var x = require("../src/vivado");

describe("LogParser()", () => {
    it("Should output two errors", () => {
        const errors = x.logParser("./public/simulate.log");
        const expected = ["V error", "C error"];
        expect(errors).toEqual(expected);
    });
});
