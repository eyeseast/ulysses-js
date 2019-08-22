// import mapboxgl purely for type checking
// this gets left out of the build
import mapboxgl from "mapbox-gl";
import * as defaultActions from "./actions.js";

class Ulysses {
  constructor({ map, steps = {}, actions = {} }) {
    if (!(map instanceof mapboxgl.Map)) {
      throw new Error("map must be an instance of mapboxgl.Map");
    }
    this.map = map;
    this.steps = steps;
    this.actions = Object.assign({}, defaultActions, actions);

    this._current = 0;
  }

  get current() {
    return this._current;
  }

  next() {
    this.step(this.current + 1);
  }

  previous() {
    this.step(this.current - 1);
  }

  step(n) {
    const feature = this.steps[n];
    if (feature === undefined) return;

    this._current = n;

    const action = getAction(feature, this.actions);

    action(this.map, feature);
  }
}

/*
Get the action function based on feature properties

First, check for an "action" property that matches a member of actions.
Next, try a default action.
- if there's a bounding box, fitBounds
- if it's a point, a point, flyTo
- if it's a polygon, fitBounds
*/
function getAction(feature, actions) {
  if ("action" in feature.properties && feature.properties.action in actions) {
    return actions[feature.properties.action];
  }

  // no defined action, get a default, starting with fitBounds
  if (feature.bbox) {
    return defaultActions.fitBounds;
  }

  // we can fly to a point
  if (feature.geometry.type === "Point") {
    return defaultActions.flyTo;
  }

  // everything else has bounds
  return defaultActions.fitBounds;
}

export default Ulysses;
