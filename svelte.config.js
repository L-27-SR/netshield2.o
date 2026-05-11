import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Try to load adapter-auto if available; fall back to a no-op adapter to avoid
// hard failures in environments where the package isn't installed (e.g. CI or
// incomplete dev setups). This keeps config usable for type checking tools.
let adapter;
try {
	// dynamic import allows the file to load even if the package is missing
	// (top-level await is supported in modern Node ESM environments).
	const mod = await import('@sveltejs/adapter-auto');
	adapter = mod.default;
} catch (e) {
	adapter = () => ({ name: 'noop-adapter' });
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
	}
};

export default config;
