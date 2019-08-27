import * as defaultActions from "./actions.js";
import { getAction } from "./utils.js";

/**
 * @param {mapboxgl.Map} map The map we're controlling. For now, only mapbox is supported.
 * @param {Object} steps A [GeoJSON feature collection](https://tools.ietf.org/html/rfc7946#section-3.3),
 * where each feature is a step in our story.
 * @param {Object} actions An object containing action functions to be called for each feature.
 * This gets merged into default actions (`flyTo`, `fitBounds`, `noop`) so you can override those
 * defaults by adding new functions of the same name.
 *
 * @class Ulysses
 */
class Ulysses {
  constructor({ map, steps = {}, actions = {} }) {
    this.map = map;
    this.steps = steps;
    this.actions = Object.assign({}, defaultActions, actions);

    this._current = -1;
  }

  /**
   * Get the current step number (zero-indexed)
   *
   * @returns {Number}
   * @readonly
   * @memberof Ulysses
   */
  get current() {
    return this._current;
  }
  /**
   * Get the number fo steps in this story
   *
   * @returns {Number}
   * @readonly
   * @memberof Ulysses
   */
  get length() {
    return this.steps.features.length;
  }
  /**
   * Advance one step (unless we're at the end)
   *
   * @memberof Ulysses
   */
  next() {
    this.step(this.current + 1);
  }
  /**
   * Go back a step (unless we're at the beginning)
   *
   * @memberof Ulysses
   */
  previous() {
    this.step(this.current - 1);
  }
  /**
   * Go to step `n`, where `n` is a step number
   *
   * @param {Number} n Go to this step
   * @memberof Ulysses
   */
  step(n) {
    const feature = this.steps.features[n];
    if (feature === undefined) return;

    this._current = n;

    const action = getAction(feature, this.actions);

    action(this.map, feature);
  }
}

export default Ulysses;
