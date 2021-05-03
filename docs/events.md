### Built-in events

A `Ulysses` object triggers events as you move through steps, and you can listen to these to keep other parts of your interface in sync. Some steps receive additional data, which a callback can use.

Note that both the `next` and `previous` events fire _before_ any actions are triggered. Use `step` for callbacks that should fire after the step completes.

**start**: Fires before the first step. No additional data is included.

**next** (`step`, `feature`): Fires each time `story.next()` is called, _before_ actually moving to the next step. The included event has two members:

- `step`: the index of _current_ step (before changing)
- `feature`: the GeoJSON feature associated with the _current_ step

**previous** (`step`, `feature`): Fires each time `story.previous()` is called, _before_ actually moving to the previous step. The included event has two members:

- `step`: the index of _current_ step (before changing)
- `feature`: the GeoJSON feature associated with the _current_ step

**step** (`step`, `feature`): Fires each time `story.step(n)` is called, _after_ the step and associated action have fired (though not necessarily after all map updates have completed). The included event has two members:

- `step`: the index of the _current_ step (after changing)
- `feature`: the GeoJSON feature associated with the _current_ step

**end**: Fires after the last step. No additional data is included.

**destroy**: Fires when `story.destroy()` method is called, just before removing event listers and running plugin cleanup functions. No additional data is included.

### Custom events

It's possible to define custom events. For example, an action might trigger a custom event to signal that it's finished, and a callback can listen for it.

```js
let success = false;

story.on("success", e => {
	success = e.success;
});

story.trigger("success", { success: true });
```
