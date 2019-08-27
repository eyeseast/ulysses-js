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
 * Extract options named in keys from properties and cast to type
 *
 * @param {Object} properties A properties object from a feature from which to extract values
 * @param {Array<string>} keys A list of keys to extract
 * @param {function} cast A function to convert keys to a different type, ie `Number`
 *
 * @returns {object} An options object, with values converted by `cast`
 */
export function extractOptions(properties, keys = [], cast = id) {
  return keys.reduce((m, k) => {
    if (k in properties) {
      m[k] = cast(properties[k]);
    }
    return m;
  }, {});
}
