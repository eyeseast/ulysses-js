import fs from "node:fs";
import path from "node:path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const pluginsOutput = "dist/ulysses/plugins";

const pkg = JSON.parse(fs.readFileSync("package.json"));

const plugins = fs.readdirSync("src/plugins").map(filename => {
	const name = path.basename(filename, ".mjs");
	return {
		input: `src/plugins/${filename}`,
		output: [
			{ file: `${pluginsOutput}/${name}.mjs`, format: "es" },
			{ file: `${pluginsOutput}/${name}.cjs`, format: "cjs" },
			{
				file: `${pluginsOutput}/${name}.umd.js`,
				format: "umd",
				name: `Ulysses.plugins.${name}`,
			},
		],
		plugins: [resolve(), commonjs()],
	};
});

export default [
	// browser-friendly UMD build
	{
		input: "src/main.mjs",
		external: ["mapbox-gl"],
		output: {
			name: "Ulysses",
			file: pkg.browser,
			format: "umd",
			globals: {
				"mapbox-gl": "mapbox-gl",
			},
		},
		plugins: [resolve(), commonjs()],
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: "src/main.mjs",
		external: ["mapbox-gl"],
		output: [
			{ file: pkg.main, format: "cjs" },
			{ file: pkg.module, format: "es" },
		],
		plugins: [resolve(), commonjs()],
	},

	// plugins
	...plugins,
];
