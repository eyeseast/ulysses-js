import bbox from "@turf/bbox";

// action utils

// it is what it is
const id = i => i;

/**
 * Get the action function based on feature properties
 *
 * First, check for an `action` property that matches a member of actions.
 * Next, try a default action.
 * - if there's a bounding box, `fitBounds`
 * - if it's a point, a point, `flyTo`
 * - if it's a polygon (or anything else, really), find a bounding box and call `fitBounds`
 *
 * @param {Object} feature a single [geojson feature](https://tools.ietf.org/html/rfc7946#section-3.2),
 * usually the one in view
 * @param {Object} actions an object with defined actions to use. Each action is a function that takes
 * a map and the current feature in view.
 * @returns {function} with the signature `action(map, feature): void`
 */
export function getAction(feature, actions) {
  if ("action" in feature.properties && feature.properties.action in actions) {
    return actions[feature.properties.action];
  }

  // no defined action, get a default, starting with fitBounds
  if (feature.bbox) {
    return actions.fitBounds;
  }

  // we can fly to a point
  if (feature.geometry.type === "Point") {
    return actions.flyTo;
  }

  // everything else has bounds
  return actions.fitBounds;
}

/**
Extract options named in keys from properties and cast to type
*/
function extractOptions(properties, keys = [], cast = id) {
  return keys.reduce((m, k) => {
    if (k in properties) {
      m[k] = cast(properties[k]);
    }
    return m;
  }, {});
}
/**
 * flyTo wraps Mapbox's Map#flyTo method, extracting arguments from feature properties
 * and centering on this feature's geometry (which should be a point).
 *
 * The following properties are extracted, converted to numbers
 * and passed to [Map#flyTo](https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto):
 *
 * - `zoom`
 * - `bearing`
 * - `pitch`
 * - `duration`
 *
 * @export
 * @param {mapboxgl.Map} map The map attached to our current story
 * @param {Object} feature The feature in view
 */
export function flyTo(map, { geometry, properties }) {
  const options = extractOptions(
    properties,
    ["zoom", "bearing", "pitch", "duration"],
    Number
  );

  if (!options.zoom) {
    options.zoom = map.getMaxZoom();
  }

  options.center = geometry.coordinates;

  map.flyTo(options);
}

/**
 * fitBounds finds a bounding box for a feature and fits the map to it,
 * using [Map#fitBounds](https://docs.mapbox.com/mapbox-gl-js/api/#map#fitbounds).
 * If the feature has a bbox attribute, that is used. Otherwise, we calculate a bounding box
 * and use that.
 *
 * The following properties are extracted, converted to numbers
 * and passed to [Map#fitBounds](https://docs.mapbox.com/mapbox-gl-js/api/#map#fitbounds):
 *
 * - `maxZoom`
 * - `bearing`
 * - `pitch`
 * - `duration`
 * - `padding` (single padding only)
 *
 * @export
 * @param {mapboxgl.Map} map The map attached to our current story
 * @param {Object} feature The feature in view
 */
export function fitBounds(map, feature) {
  const options = extractOptions(
    feature.properties,
    ["maxZoom", "bearing", "pitch", "duration", "padding"],
    Number
  );

  const bounds = feature.bbox ? feature.bbox : bbox(feature);

  map.fitBounds(bounds, options);
}

/**
 * noop is the best action because it wants nothing and gives nothing in return
 *
 * @export
 */
export function noop() {}
