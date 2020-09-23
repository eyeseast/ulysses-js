require = require("esm")(module);
const fs = require("fs");
const path = require("path");

const Ulysses = require("../src/main.js");

const fires = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, "../docs/examples/data/fires-2018.json"))
);

let story;
let map;

beforeEach(() => {
	map = new MockMap();
	story = new Ulysses({ map, steps: fires });
});

describe("tests for events", () => {
	test("register a listener", () => {
		//story.on("step", e => {});
	});
});

// like a mapbox map, except it doesn't do anything
class MockMap {
	constructor() {
		// each log item is a pair of [string, array]
		// with the name of a method and its arguments
		this.log = [];
	}

	record(name, args) {
		this.log.push([name, args]);
	}

	fitBounds(...args) {
		this.record("fitBounds", args);
	}

	flyTo(...args) {
		this.record("flyTo", args);
	}

	getMaxZoom(...args) {
		this.record("getMaxZoom", args);
	}
}
