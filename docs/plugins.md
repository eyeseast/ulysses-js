A plugin is a function that adds functionality to a Ulysses instance. Add plugins in one of two ways:

```js
// when creating a story, use the `plugins` array
const story = new Ulysses({ map, steps, plugins: [func, anotherFunc] });

// later, with the `use()` method
story.use(plugin);
```

In each case, the plugin callable takes a `Ulysses` instance as its only argument. For plugins that take configuration, you can use a function that returns a function. Finally, the plugin function _may_ return a cleanup function, which will be called when a Ulysses instance is destroyed.

Here's an example plugin that adds keyboad controls:

```js
export default function keys({ previous = "ArrowLeft", next = "ArrowRight" } = {}) {
	return story => {
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

		window.addEventListener("keydown", keydown);

		// on destroy
		return () => {
			window.removeEventListener("keydown", keydown);
		};
	};
}

// later
story.use(keys());

// when we're done, this will remove the event listener
story.destroy();
```

The first function -- `keys()` -- is called to initialize the plugin and returns a function. That function is called with our `Ulysses` instance. When the story is eventually destroyed (for example, when routing to a new URL in a single-page application), the final cleanup function will remove event listers on the `window`.
