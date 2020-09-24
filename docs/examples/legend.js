class Legend {
	onAdd(map) {
		this._map = map;
		this._container = document.createElement("div");
		this._container.className = "mapboxgl-ctrl legend";
		return this._container;
	}

	addTo(map, position) {
		map.addControl(this, position);
		return this;
	}

	setContent(html) {
		this._container.innerHTML = html;
		return this;
	}

	onRemove() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}
}

export default Legend;
