/* tests for actions */
require = require("esm")(module);
const fs = require("fs");
const path = require("path");
const { extractOptions, getAction } = require("../src/utils.mjs");
const actions = require("../src/actions.mjs");

const feature = {
	type: "Feature",
	id: "_fK8gYjGcdlGA09B3a4a8RyUZD4=",
	properties: {
		ref: "255",
		"@spider": "innout",
		"addr:full": "190 E. Stacy Rd.",
		"addr:city": "Allen",
		"addr:state": "TX",
		"addr:postcode": "75002",
		name: "Allen",
		website: "http://locations.in-n-out.com/255",
		zoom: "5",
		bearing: "87",
	},
	geometry: { type: "Point", coordinates: [-96.65328, 33.12914] },
};

const fires = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, "../docs/examples/data/fires-2018.json"))
);

describe("tests for creating and calling actions", () => {
	test("extract options", () => {
		const options = extractOptions(feature.properties, ["zoom", "bearing"], Number);

		expect(options.zoom).toBe(5);
		expect(options.bearing).toBe(87);
	});

	test("get action", () => {
		const action = getAction(feature, actions);

		expect(action).toBe(actions.flyTo);
	});

	test("bbox overrides point", () => {
		const feature = fires.features[0];
		const action = getAction(feature, actions);

		// establish here that we have a point feature with a bbox
		// and bbox will win, in this case
		expect(feature.geometry.type).toBe("Point");
		expect(feature.bbox.length).toBe(4);

		expect(action).toBe(actions.fitBounds);
	});
});
