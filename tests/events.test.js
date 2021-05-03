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

	test("listen for a step", () => {
		story.on("step", e => {
			expect(e.step).toBe(1);
			expect(e.feature).toBe(fires.features[1]);
		});

		story.step(1);
		expect(story.current).toBe(1);
	});

	test("listen for next", () => {
		story.on("next", e => {
			expect(e.step).toBe(-1);
			expect(e.feature).toBe(undefined);
		});

		story.next();
		expect(story.current).toBe(0);
	});

	test("listen for previous", () => {
		story.step(3);
		expect(story.current).toBe(3);

		story.on("previous", e => {
			expect(e.step).toBe(3);
			expect(e.feature).toBe(fires.features[3]);
		});

		story.previous();
		expect(story.current).toBe(2);
	});

	test("listen for start", () => {
		let started = false;
		story.on("start", e => {
			started = true;
		});

		story.next();

		expect(started).toBe(true);
	});

	test("listen for start on step 0", () => {
		let started = false;
		story.on("start", e => {
			started = true;
		});

		story.step(0);

		expect(started).toBe(true);
	});

	test("only start once", () => {
		let count = 0;
		story.on("start", e => {
			count++;
		});

		story.next();

		expect(count).toBe(1);
	});

	test("listen for end", () => {
		let ended = false;

		story.on("end", e => {
			ended = true;
		});

		story.step(story.length - 1);

		expect(ended).toBe(true);
	});

	test("listen for destroy", () => {
		let destroyed = false;
		story.on("destroy", () => {
			destroyed = true;
		});
		story.destroy();
		expect(destroyed).toBe(true);
	});

	test("create and listen for a custom event", () => {
		let success = false;

		story.on("success", e => {
			success = e.success;
		});

		story.trigger("success", { success: true });

		expect(success).toBe(true);
	});
});
