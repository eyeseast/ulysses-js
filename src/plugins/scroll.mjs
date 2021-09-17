/* scrollama integration */
import scrollama from "scrollama";
/**
 * Add scroll interaction to a Ulysses story using scrollama.
 * As each element scrolls into view, the story will trigger a step.
 *
 * Any options given during initialization are passed through to scrollama.
 * See [scrollama's API documentation](https://github.com/russellgoldenberg/scrollama#scrollamasetupoptions)
 * for a full list of available options.
 *
 * Usage:
 * ```js
 * import scroll from "ulysses/plugins/scroll.mjs"
 *
 * story.use(scroll({ step: ".step" }))
 * ```
 *
 * @export
 * @param {scrollama.ScrollamaOptions} [options={}]
 * @returns {Function(Ulysses)}
 */
export default function scroll(options = {}) {
	return story => {
		const scroller = scrollama().setup(options);

		scroller.onStepEnter(({ element, index, direction }) => {
			story.trigger("scroll.stepenter", { element, index, direction });
			story.step(index);
		});

		scroller.onStepExit(({ element, index, direction }) => {
			story.trigger("scroll.stepexit", { element, index, direction });
		});

		story.scroller = scroller;

		return () => {
			scroller.destroy();
		};
	};
}
