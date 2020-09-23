# Ulysses

This is a tool for creating stories around maps.

Docs: https://eyeseast.github.io/ulysses-js/

For example, I want to step sequentially through the 10 largest wildfires in California this year. For each fire, I want to fly across the map so the entire fire is in view. For one of those fires, I want to change the map orientation. Finally, I want to zoom out to see all of California.

This library provides a way to describe those actions and link them to each narrative step. How those steps are triggered -- scrolling, clicking, timed, something else -- is up to you. There's no built in UI here, because that's the thing that should be bespoke. But syncing a map to actions in a standard way gets us a running start.

Steps are defined as a [GeoJSON feature collection](https://tools.ietf.org/html/rfc7946#section-3.3). Each feature can specify an `action` property, pointing to a function. Or it can use standard actions, like centering on a point or fitting the map to a bounding box. Each action function takes the map and a single feature.

## Examples

View source on these to see the setup.

### [The biggest fires of 2018](https://eyeseast.github.io/ulysses-js/examples/fires.html)

Use the left and right arrow keys to move through the 10 largest
wildfires for 2018.

Use numbers 0 through 9 to jump to a specific
fire.

### [Every In-N-Out](https://eyeseast.github.io/ulysses-js/examples/innout.html)

Jump to a new In-N-Out location every few seconds. Hit the spacebar to
stop and start.

Source: [All the Places](https://github.com/alltheplaces/alltheplaces)

## Installation

Install [with npm](https://www.npmjs.com/package/ulysses-js):

```sh
npm install ulysses-js
```

This will also install the latest version of [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/), though that may become a peer dependency in the future.

## Background and prior art

I've done a couple maps now where I want a user to scroll or click through a series of steps and have the map do something on each step. Examples:

- [The Rivalry Behind Three Wars](http://apps.frontline.org/bitter-rivals-maps/): Scroll through text on one side and the map in the other column highlights countries of interest.
- [Sex spa raids](https://www.usatoday.com/in-depth/news/investigations/2019/07/29/sex-trafficking-illicit-massage-parlors-cases-fail/1206517001/): Near the bottom, the map highlights CPA firms tied to raids on massage parlors around Florida.

Here's one from Mapbox itself: https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/

Those are all pretty bespoke. I'd like to standardize how I build those so I can focus on the surrounding UI instead of wiring up steps and actions each time.

There was, years ago, this cool project called Odyssey.js for making stories like this. It's a full stack package, including an editor. And also it's dead. But the concept is cool.

This is a good source of inspiration (including for the name I'm using).

[KnightLab](https://knightlab.northwestern.edu/) also has a project called [StoryMap](https://storymap.knightlab.com/), which includes a data format and a UI. If you want something more turnkey, check out that project.

## Usage and API

At its heart, this library provides a connection between a map, a series of steps and a set of actions.

```js
// package imports
import Ulysses from "ulysses-js";
import mapboxgl from "mapbox-gl";

// steps and actions are up to you
import * as actions from "./actions.js"; // put all our custom actions in a module
import steps from "./steps.json"; // store our steps feature collection as a geojson file and import it, or load via ajax
```

### Create a story

```js
const map = new Map({ ... }) // see Mapbox docs https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart
const story = new Ulysses({ map, steps, actions })
```

### methods

```js
story.current; // 0 (readonly getter)
story.next(); // go to next step and run that action
story.previous(); // go back a step
story.step(n); // go to step n and run that action
```

### properties

```js
story.map; // our attached map object
story.steps; // steps passed in
story.actions; // actions passed in
```

## Steps and actions

Each step is a GeoJSON feature. For example:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [0, 0]
  },
  "properties": {
    "action": "showCountries",
    "countries": ["US", "UK", "CAN"],
    "text": "This is some text."
  }
}
```

The map should call a function called `showCountries` like this:

```
actions["showCountries"](map, feature)
```

That assumes that `actions` is an object with a method called `showCountries`. The function can then do whatever it wants with `map` and `feature`.

Since the map defines an `action` property, it won't pan or zoom to this feature's point. That's left to the action function, which can move the map or not.

The action function can use whichever properties (or geometry) it wants. So there's a `text` field which would be useful for the UI but might be ignored by the action.

## Built-in actions

These get included by default. Override them by defining a method of the same name on your `actions` object.

- `noop`: Do nothing. Useful if you need a narrative step that doesn't affect the map.
- `flyTo`: Fly to this spot. This is what happens for `Point` features.
- `fitBounds`: Do this for `Polygon` and `bbox` features.
