import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			pages: 'build', // Default, ensure this matches your Dockerfile COPY source
			assets: 'build', // Default
			fallback: 'index.html' // Or '200.html' for some SPA routing strategies
		})
	},

	extensions: ['.svelte', '.svx']
};

export default config;
