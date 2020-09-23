import bbox from "@turf/bbox";
import { extractOptions } from "./utils.mjs";

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
 */
export function noop() {}
