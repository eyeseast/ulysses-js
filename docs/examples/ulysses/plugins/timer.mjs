/* advance steps on a timer */
/**
 * Add a timer that advances the map every `duration` seconds.
 *
 * Usage:
 * ```js
 * import timer from "ulysses/plugins/timer.mjs"
 *
 * story.use(timer({ duration: 5000, toggle: "Space", start: true }))
 * ```
 * This plugin adds additional methods to a Ulysses instance:
 *
 * - `Ulysses#start()` - Start the timer
 * - `Ulysses#stop()` - Stop the timer
 * - `Ulysses#toggle()` - Stop or start, depending on current state
 *
 * Each of these emits an event -- `timer.start`, `timer.stop`, `timer.toggle` --
 * that can be used to coordinate other actions.
 *
 *
 * @export
 * @param {Object} options [{ duration, toggle = "Space" }={}]
 * @param {Number} options.duration Time between steps, in milliseconds (default: 5000)
 * @param {Space} options.toggle Key to toggle starting and stopping the timer (default: `"Space"`)
 * @param {Boolean} options.start Start the timer immediately. If false, call `story.start()` to begin.
 * @returns
 */
function timer({
	duration = 5000,
	toggle = "Space",
	start = true,
} = {}) {
	return story => {
		Object.assign(story, {
			start() {
				story.trigger("timer.start");
				story._interval = setInterval(() => {
					story.next();
				}, duration);
			},

			stop() {
				story.trigger("timer.stop");
				clearInterval(story._interval);
				delete story._interval;
			},

			toggle(e) {
				if (e.code === toggle || e.key === toggle) {
					story.trigger("timer.toggle");
					story._interval ? story.stop() : story.start();
				}
			},
		});

		window.addEventListener("keydown", story.toggle);

		if (start) {
			story.start();
		}

		return () => {
			story.stop();
			window.removeEventListener("keydown", story.toggle);

			delete story.stop;
			delete story.start;
			delete story.toggle;
			delete story._callbacks["timer.start"];
			delete story._callbacks["timer.stop"];
			delete story._callbacks["timer.toggle"];
		};
	};
}

export default timer;
