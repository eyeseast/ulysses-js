import * as defaultActions from "./actions.mjs";
import { getAction } from "./utils.mjs";

/**
 * Ulysses creates a narrative around geography by linking narrative steps to actions on a map.
 * Each step is a feature in a [GeoJSON feature collection](https://tools.ietf.org/html/rfc7946#section-3.3),
 * with a specific action defined as a property.
 *
 * Actions are functions that change the map state -- panning, zooming, rotating, adding or removing layers --
 * anything you can do with the underlying map.
 *
 * @param {mapboxgl.Map} map The map we're controlling. For now, only mapbox is supported.
 * @param {Object|Array} steps A [GeoJSON feature collection](https://tools.ietf.org/html/rfc7946#section-3.3),
 * or an array of features, where each feature is a step in our story.
 * @param {Object} actions An object containing action functions to be called for each feature.
 * This gets merged into default actions (`flyTo`, `fitBounds`, `noop`) so you can override those
 * defaults by adding new functions of the same name.
 * @param {Array[Function]} plugins An array of plugin functions to apply to this instance
 *
 * @class Ulysses
 */
class Ulysses {
	constructor({ map, steps = {}, actions = {}, plugins = [] }) {
		this.map = map;
		if (Array.isArray(steps)) {
			steps = { type: "FeatureCollection", features: steps };
		}
		this.steps = steps;
		this.actions = Object.assign({}, defaultActions, actions);

		this._current = -1;

		// define our default events
		this._callbacks = Object.assign(Object.create(null), {
			step: [],
			next: [],
			previous: [],
			start: [],
			end: [],
			destroy: [],
		});

		this._plugins = plugins.map(plugin => plugin(this));
	}

	/**
	 * Get the current step number (zero-indexed)
	 *
	 * @returns {Number}
	 * @readonly
	 * @instance Ulysses
	 * @property
	 */
	get current() {
		return this._current;
	}
	/**
	 * Get the number fo steps in this story
	 *
	 * @returns {Number}
	 * @readonly
	 * @instance Ulysses
	 */
	get length() {
		return this.steps.features.length;
	}
	/**
	 * Advance one step (unless we're at the end)
	 *
	 * @instance Ulysses
	 * @method
	 */
	next() {
		this.trigger("next", {
			step: this.current,
			feature: this.current > -1 ? this.steps.features[this.current] : undefined,
		});
		this.step(this.current + 1);
	}
	/**
	 * Go back a step (unless we're at the beginning)
	 *
	 * @instance Ulysses
	 */
	previous() {
		this.trigger("previous", {
			step: this.current,
			feature: this.steps.features[this.current],
		});
		this.step(this.current - 1);
	}
	/**
	 * Go to step `n`, where `n` is a step number
	 *
	 * @param {Number} n Go to this step
	 * @instance Ulysses
	 */
	step(n) {
		const feature = this.steps.features[n];
		if (feature === undefined) return;

		if (this.current === -1) {
			this.trigger("start");
		}
		this._current = n;

		const action = getAction(feature, this.actions);

		action(this.map, feature);

		this.trigger("step", { step: n, feature });

		if (n === this.length - 1) {
			this.trigger("end");
		}
	}

	// events
	/**
	 * Register a callback for a given event
	 *
	 * @param {String} event
	 * @param {Function} callback
	 * @instance Ulysses
	 * @returns {Function} unsubscribe function
	 */
	on(event, callback) {
		if (!Array.isArray(this._callbacks[event])) {
			this._callbacks[event] = [];
		}

		this._callbacks[event].push(callback);

		return () => {
			this.off(event, callback);
		};
	}

	/**
	 * Register a callback for an event that only fires once
	 *
	 * @param {String} event
	 * @param {Function} callback
	 * @instance Ulysses
	 */

	once(event, callback) {
		this.on(event, e => {
			this.off(event, callback);
			callback.call(this, e);
		});
	}

	/**
	 * Remove a callback for a given event. If callback is `undefined`, remove all callbacks for that event.
	 *
	 * @param {String} event
	 * @param {Function} callback
	 * @instance Ulysses
	 */
	off(event, callback) {
		// noop
		if (!Array.isArray(this._callbacks[event])) return;

		// remove all
		if (!callback) {
			this._callbacks[event] = [];
		}

		// remove one
		const i = this._callbacks[event].indexOf(callback);
		if (i > -1) {
			this._callbacks[event].splice(i, 1);
		}
	}

	/**
	 * Fire callbacks for a given event. This is used internally but may be useful in actions and plugins.
	 * The `detail` object is passed to callback functions.
	 *
	 * @param {String} event
	 * @param {Object} [detail={}]
	 * @instance Ulysses
	 */
	trigger(event, detail = {}) {
		const callbacks = this._callbacks[event];

		if (!Array.isArray(callbacks)) return;

		callbacks.forEach(f => {
			f.call(this, detail);
		});
	}

	// plugins
	/**
	 * Apply a plugin function to this Ulysses instance
	 *
	 * @param {Function} plugin
	 * @instance Ulysses
	 * @returns {ThisType}
	 */
	use(plugin) {
		this._plugins.push(plugin(this));
	}
	/**
	 * Remove event listers and call plugin cleanup functions.
	 * Triggers a "destroy" event with no data.
	 *
	 * @instance Ulysses
	 */
	destroy() {
		this.trigger("destroy");
		// remove all events
		this._callbacks = {};

		// run plugin cleanup
		this._plugins.forEach(f => {
			if (typeof f === "function") {
				f();
			}
		});
	}
}

export default Ulysses;
