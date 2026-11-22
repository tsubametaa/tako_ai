import type { Handle } from '@sveltejs/kit/hooks';
import {
  resolveCanonicalRedirect,
  resolveSiteFromHostname,
} from '$lib/shared/config/subdomains';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.site = resolveSiteFromHostname(event.url.hostname);

  if (!event.isDataRequest) {
    const redirectLocation = resolveCanonicalRedirect(event.url);
    if (redirectLocation) {
      return new Response(null, {
        status: 308,
        headers: { location: redirectLocation },
      });
    }
  }

  return resolve(event);
};
