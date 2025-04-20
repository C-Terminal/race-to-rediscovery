// import { mdsvex } from 'mdsvex';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import adapter from '@sveltejs/adapter-static';
// console.log('>>> USING svelte.config.js');
// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	preprocess: [vitePreprocess(), mdsvex()],
// 	adapter: adapter({
//         pages: 'build', // Default, ensure this matches your Dockerfile COPY source
//         assets: 'build', // Default
//         fallback: 'index.html' // Or '200.html' for some SPA routing strategies
//     }),
// 	extensions: ['.svelte', '.svx']
// };

// export default config;

import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
