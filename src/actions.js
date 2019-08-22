import bbox from "@turf/bbox";

// action utils

// it is what it is
const id = i => i;

/*
Extract options named in keys from properties and cast to type
*/
function extractOptions(properties, keys = [], cast = id) {
  return keys.reduce((m, k) => {
    m[k] = cast(properties[k]);
    return m;
  }, {});
}

/*
flyTo wraps Mapbox's Map#flyTo method, extracting arguments from feature properties
and centering on this feature's geometry (which should be a point)
*/
export function flyTo(map, { geometry, properties }) {
  const options = extractOptions(
    properties,
    ["zoom", "bearing", "pitch", "duration"],
    Number
  );

  options.center = geometry.coordinates;

  map.flyTo(options);
}

/*
fitBounds finds a bounding box for a feature and fits the map to it, using Map#fitBounds.
If the feature has a bbox attribute, that is used. Otherwise, we calculate a bounding box
and use that.
*/
export function fitBounds(map, feature) {
  const options = extractOptions(
    properties,
    ["zoom", "bearing", "pitch", "duration", "padding"],
    Number
  );

  const bounds = feature.bbox ? feature.bbox : bbox(feature);

  map.fitBounds(bounds, options);
}

export function noop() {}
