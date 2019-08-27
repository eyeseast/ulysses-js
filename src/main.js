import * as defaultActions from "./actions.js";
import { getAction } from "./utils.js";

/**
 * @param {mapboxgl.Map} map
 * @param {Object} steps
 * @param {Object} actions
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

  get current() {
    return this._current;
  }

  get length() {
    return this.steps.features.length;
  }

  next() {
    this.step(this.current + 1);
  }

  previous() {
    this.step(this.current - 1);
  }

  step(n) {
    const feature = this.steps.features[n];
    if (feature === undefined) return;

    this._current = n;

    const action = getAction(feature, this.actions);

    action(this.map, feature);
  }
}

export default Ulysses;
