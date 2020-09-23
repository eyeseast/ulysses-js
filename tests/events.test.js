require = require("esm")(module);
const fs = require("fs");
const path = require("path");
const mock = require("./mocks.mjs");

const Ulysses = require("../src/main.mjs").default;

const fires = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, "../docs/examples/data/fires-2018.json"))
);

let story;
let map;

beforeEach(() => {
	map = new mock.Map();
	story = new Ulysses({ map, steps: fires });
});

describe("tests for events", () => {
	test("register a listener", () => {
		story.on("step", e => {});
	});
});
