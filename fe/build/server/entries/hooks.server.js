import { a as resolveCanonicalRedirect, s as resolveSiteFromHostname } from "../chunks/subdomains.js";
//#region src/hooks.server.ts
var handle = async ({ event, resolve }) => {
	event.locals.site = resolveSiteFromHostname(event.url.hostname);
	if (!event.isDataRequest) {
		const redirectLocation = resolveCanonicalRedirect(event.url);
		if (redirectLocation) return new Response(null, {
			status: 308,
			headers: { location: redirectLocation }
		});
	}
	return resolve(event);
};
//#endregion
export { handle };

//# sourceMappingURL=hooks.server.js.map