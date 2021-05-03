(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, (global.Ulysses = global.Ulysses || {}, global.Ulysses.plugins = global.Ulysses.plugins || {}, global.Ulysses.plugins.keys = factory()));
}(this, (function () { 'use strict';

	/* plugin for keyboard controls */
	/**
	 * Add keyboard controls to a story. By default, this adds listeners for the
	 * left and right keys, stepping backward and forward, respectively. Using the
	 * numeric keys 0 - 9 will go to those steps.
	 *
	 * Usage:
	 * ```js
	 * import keys from "ulysses/plugins/keys.mjs"
	 *
	 * story.use(keys({ previous: "ArrowLeft", next: "ArrowRight" }))
	 * ```
	 *
	 * See [Every fire in 2018](./examples/fires.html)
	 *
	 * @export
	 * @param {Object} options [{ previous = "ArrowLeft", next = "ArrowRight" }={}]
	 * @param {String} options.previous Use this key to go to the previous step. Default: `ArrowLeft`
	 * @param {String} options.next Use this key to go to the next step. Default: `ArrowRight`
	 * @returns {Function(Ulysses)}
	 */
	function keys({ previous = "ArrowLeft", next = "ArrowRight" } = {}) {
		function keydown({ key }) {
			if (key === previous) {
				story.previous();
			}

			if (key === next) {
				story.next();
			}

			if (key.match(/\d{1}/)) {
				story.step(+e.key);
			}
		}

		return story => {
			window.addEventListener("keydown", keydown);

			// on destroy
			return () => {
				window.removeEventListener("keydown", keydown);
			};
		};
	}

	return keys;

})));
