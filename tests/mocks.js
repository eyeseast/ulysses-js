/*
Mocked objects that record what happens
*/

// like a mapbox map, except it doesn't do anything
class Map {
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

module.exports = { Map };
