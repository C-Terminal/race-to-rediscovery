// import type { Handle } from '@sveltejs/kit';
// import { paraglideMiddleware } from '$lib/paraglide/server';

// const handleParaglide: Handle = ({ event, resolve }) =>
// 	paraglideMiddleware(event.request, ({ request, locale }) => {
// 		event.request = request;

// 		return resolve(event, {
// 			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
// 		});
// 	});

// export const handle: Handle = handleParaglide;

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Add internal API URL for server-side fetches
	event.locals.apiBaseUrl = process.env.INTERNAL_API_BASE_URL || 'http://localhost:8000';
	
	return await resolve(event);
  }