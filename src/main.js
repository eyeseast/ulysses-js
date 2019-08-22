// import mapboxgl purely for type checking
// this gets left out of the build
import mapboxgl from "mapbox-gl";

class Ulysses {
  constructor({ map, steps = {}, actions = {} }) {
    if (!(map instanceof mapboxgl.Map)) {
      throw new Error("map must be an instance of mapboxgl.Map");
    }
    this.map = map;
    this.steps = steps;
    this.actions = actions;

    this._current = 0;
  }

  get current() {
    return this._current;
  }

  next() {}

  previous() {}

  step(n) {}
}

export default Ulysses;
