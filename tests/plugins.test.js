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

function dummyPlugin(story) {
	console.debug("Adding dummy plugin");
	story.hasDummyPlugin = true;

	return () => {
		console.debug("Cleaning up dummy plugin");
		delete story.hasDummyPlugin;
	};
}

beforeEach(() => {
	map = new mock.Map();
	story = new Ulysses({ map, steps: fires });
});

describe("tests for plugin API", () => {
	test("use dummy plugin", () => {
		expect(story.hasDummyPlugin).toBe(undefined);
		story.use(dummyPlugin);
		expect(story.hasDummyPlugin).toBe(true);
	});

	test("add plugins in constructor", () => {
		story = new Ulysses({ map, steps: fires, plugins: [dummyPlugin] });
		expect(story.hasDummyPlugin).toBe(true);
	});

	test("run cleanup in destroy lifecycle", () => {
		story.use(dummyPlugin);
		expect(story.hasDummyPlugin).toBe(true);

		expect(story._plugins.length).toBe(1);

		story.destroy();
		expect(story.hasDummyPlugin).toBe(undefined);
	});
});
