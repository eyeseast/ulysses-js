/* plugin for keyboard controls */

export default function keys({ previous = "ArrowLeft", next = "ArrowRight" }) {
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

	return story => {
		window.addEventListener("keydown", keydown);

		// on destroy
		return () => {
			window.removeEventListener("keydown", keydown);
		};
	};
}
