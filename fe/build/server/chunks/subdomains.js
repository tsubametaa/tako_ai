//#region src/lib/shared/config/subdomains.ts
var STATIC_EXT_PATTERN = /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|mjs|png|svg|txt|webmanifest|webp|woff|woff2|xml)$/i;
var HOST_TO_SITE = {
	"ai.utaaa.io": "home",
	"utaaa.io": "home",
	"www.utaaa.io": "home",
	"chat.utaaa.io": "chat",
	"admin.utaaa.io": "admin",
	"auth.utaaa.io": "auth",
	"tako.ai.id": "home",
	"www.tako.ai.id": "home",
	"chat.tako.ai.id": "chat",
	"admin.tako.ai.id": "admin",
	"auth.tako.ai.id": "auth",
	"tako.localhost": "home",
	"www.tako.localhost": "home",
	"chat.tako.localhost": "chat",
	"admin.tako.localhost": "admin",
	"auth.tako.localhost": "auth",
	"ai.localhost": "home",
	"chat.localhost": "chat",
	"admin.localhost": "admin",
	"auth.localhost": "auth"
};
function normalizeHostname(raw) {
	const trimmed = raw.trim().toLowerCase();
	if (trimmed.startsWith("[")) return trimmed;
	const colonIndex = trimmed.indexOf(":");
	return colonIndex === -1 ? trimmed : trimmed.slice(0, colonIndex);
}
function resolveDomainBase(hostname) {
	const host = normalizeHostname(hostname);
	if (host === "utaaa.io" || host.endsWith(".utaaa.io")) return {
		rootDomain: "utaaa.io",
		homeHost: "ai.utaaa.io"
	};
	if (host === "tako.ai.id" || host.endsWith(".tako.ai.id")) return {
		rootDomain: "tako.ai.id",
		homeHost: "tako.ai.id"
	};
	if (host === "tako.localhost" || host.endsWith(".tako.localhost")) return {
		rootDomain: "tako.localhost",
		homeHost: "tako.localhost"
	};
	if (host === "ai.localhost" || host === "chat.localhost" || host === "admin.localhost" || host === "auth.localhost") return {
		rootDomain: "localhost",
		homeHost: "ai.localhost"
	};
	return null;
}
function isPassthroughPath(pathname) {
	return pathname.startsWith("/_app/") || pathname.startsWith("/api/") || STATIC_EXT_PATTERN.test(pathname);
}
function hasPathPrefix(pathname, prefix) {
	return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
function stripPathPrefix(pathname, prefix) {
	if (pathname === prefix) return "/";
	if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || "/";
	return pathname || "/";
}
function ensureLeadingSlash(path) {
	if (!path) return "/";
	return path.startsWith("/") ? path : `/${path}`;
}
function defaultPrefixForSite(site) {
	if (site === "home") return "/home";
	if (site === "chat") return "/chat";
	if (site === "admin") return "/admin";
	return "/login";
}
function isTrustedCrossSiteUrl(candidate, currentUrl, base) {
	try {
		const parsed = new URL(candidate);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
		const targetSite = resolveSiteFromHostname(parsed.hostname);
		const sameRoot = resolveDomainBase(parsed.hostname)?.rootDomain === base.rootDomain;
		const samePort = (parsed.port || "") === (currentUrl.port || "");
		if (!sameRoot || !samePort || !targetSite || targetSite === "auth") return null;
		return parsed.toString();
	} catch {
		return null;
	}
}
function resolveSiteFromHostname(hostname) {
	return HOST_TO_SITE[normalizeHostname(hostname)] ?? null;
}
function resolveSubdomainPathname(url) {
	const { pathname } = url;
	if (isPassthroughPath(pathname)) return void 0;
	const site = resolveSiteFromHostname(url.hostname);
	if (site === "auth") {
		if (pathname === "/") return "/login";
		return;
	}
	if (site === "chat") {
		if (pathname === "/") return "/chat";
		return;
	}
	if (site === "admin") {
		if (pathname === "/") return "/admin";
		if (pathname === "/login" || hasPathPrefix(pathname, "/admin") || hasPathPrefix(pathname, "/chat") || hasPathPrefix(pathname, "/home")) return;
		return `/admin${pathname}`;
	}
	if (pathname === "/") return "/home";
}
function buildSiteUrl(targetSite, currentUrl, path = "/") {
	const normalizedPath = ensureLeadingSlash(path);
	const base = resolveDomainBase(currentUrl.hostname);
	if (!base) {
		const prefix = defaultPrefixForSite(targetSite);
		if (normalizedPath === "/") return prefix;
		if (normalizedPath.startsWith("/?")) return `${prefix}${normalizedPath.slice(1)}`;
		if (hasPathPrefix(normalizedPath, prefix)) return normalizedPath;
		if (targetSite === "home" && normalizedPath === "/login") return "/login";
		return `${prefix}${normalizedPath}`;
	}
	const targetHost = targetSite === "home" ? base.homeHost : `${targetSite}.${base.rootDomain}`;
	const port = currentUrl.port ? `:${currentUrl.port}` : "";
	return `${currentUrl.protocol}//${targetHost}${port}${normalizedPath}`;
}
function buildSitePath(site, currentUrl, subPath = "/") {
	const normalizedSubPath = ensureLeadingSlash(subPath);
	if (resolveSiteFromHostname(currentUrl.hostname) === site) return normalizedSubPath;
	const prefix = defaultPrefixForSite(site);
	return normalizedSubPath === "/" ? prefix : `${prefix}${normalizedSubPath}`;
}
function normalizeSitePathname(site, pathname) {
	return stripPathPrefix(pathname, defaultPrefixForSite(site));
}
function buildAuthLoginUrl(currentUrl, returnTarget) {
	const base = resolveDomainBase(currentUrl.hostname);
	if (!base) {
		if (returnTarget && returnTarget.startsWith("/") && !returnTarget.startsWith("//") && returnTarget !== "/login") return `/login?next=${encodeURIComponent(returnTarget)}`;
		return "/login";
	}
	if (returnTarget && isTrustedCrossSiteUrl(returnTarget, currentUrl, base)) return buildSiteUrl("auth", currentUrl, `/?next=${encodeURIComponent(returnTarget)}`);
	return buildSiteUrl("auth", currentUrl, "/");
}
function isTeacherRole(userRole) {
	const normalized = userRole?.trim().toLowerCase();
	return normalized === "teacher" || normalized === "guru" || normalized === "admin";
}
function resolveSafePostLoginTarget(currentUrl, userRole) {
	const rawNext = currentUrl.searchParams.get("next")?.trim();
	const base = resolveDomainBase(currentUrl.hostname);
	const teacher = isTeacherRole(userRole);
	const defaultSite = teacher ? "admin" : "chat";
	if (rawNext && !rawNext.includes("\\") && !rawNext.startsWith("//")) {
		if (rawNext.startsWith("/")) {
			const pointsToAdmin = hasPathPrefix(rawNext, "/admin");
			if (teacher) {
				if (pointsToAdmin) return base ? buildSiteUrl("admin", currentUrl, stripPathPrefix(rawNext, "/admin")) : rawNext;
			} else if (!pointsToAdmin) {
				if (!base) return rawNext === "/login" ? defaultPrefixForSite(defaultSite) : rawNext;
				if (hasPathPrefix(rawNext, "/chat")) return buildSiteUrl("chat", currentUrl, rawNext);
				if (hasPathPrefix(rawNext, "/home")) return buildSiteUrl("home", currentUrl, stripPathPrefix(rawNext, "/home"));
			}
		} else if (base) {
			const trustedUrl = isTrustedCrossSiteUrl(rawNext, currentUrl, base);
			if (trustedUrl) {
				const targetSite = resolveSiteFromHostname(new URL(trustedUrl).hostname);
				if (teacher && targetSite === "admin") return trustedUrl;
				if (!teacher && targetSite !== "admin") return trustedUrl;
			}
		}
	}
	if (!base) return defaultPrefixForSite(defaultSite);
	return buildSiteUrl(defaultSite, currentUrl, "/");
}
function buildAuthRedirectFromSite(url, returnSite) {
	const params = new URLSearchParams(url.searchParams);
	if (!params.has("next")) params.set("next", buildSiteUrl(returnSite, url, "/"));
	return buildSiteUrl("auth", url, `/?${params.toString()}`);
}
var ROUTE_PREFIXES = [
	{
		prefix: "/home",
		targetSite: "home"
	},
	{
		prefix: "/chat",
		targetSite: "chat"
	},
	{
		prefix: "/admin",
		targetSite: "admin"
	}
];
function resolveCanonicalRedirect(url) {
	const { pathname, search } = url;
	if (isPassthroughPath(pathname)) return null;
	const site = resolveSiteFromHostname(url.hostname);
	if (!site) return null;
	if (pathname === "/login") {
		if (site === "auth") return `/${search}`;
		return buildAuthRedirectFromSite(url, site === "admin" ? "admin" : "chat");
	}
	for (const { prefix, targetSite } of ROUTE_PREFIXES) {
		if (!hasPathPrefix(pathname, prefix)) continue;
		if (site === targetSite) {
			if (targetSite === "chat") return null;
			return `${stripPathPrefix(pathname, prefix)}${search}`;
		}
		return `${buildSiteUrl(targetSite, url, targetSite === "chat" ? pathname === "/chat" ? "/" : pathname : stripPathPrefix(pathname, prefix))}${search}`;
	}
	return null;
}
//#endregion
export { resolveCanonicalRedirect as a, resolveSubdomainPathname as c, normalizeSitePathname as i, buildSitePath as n, resolveSafePostLoginTarget as o, buildSiteUrl as r, resolveSiteFromHostname as s, buildAuthLoginUrl as t };

//# sourceMappingURL=subdomains.js.map