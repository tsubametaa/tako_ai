export type SubdomainSite = 'home' | 'chat' | 'admin' | 'auth';

export type SiteUrlOrigin = Pick<URL, 'hostname' | 'protocol' | 'port'>;
export type SiteHostRef = Pick<URL, 'hostname'>;
export type SiteRedirectUrl = Pick<
  URL,
  'hostname' | 'protocol' | 'port' | 'pathname'
> & {
  readonly searchParams: Pick<URLSearchParams, 'get'>;
};

interface DomainBase {
  rootDomain: string;
  homeHost: string;
}

const STATIC_EXT_PATTERN =
  /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|mjs|png|svg|txt|webmanifest|webp|woff|woff2|xml)$/i;

const HOST_TO_SITE: Record<string, SubdomainSite> = {
  'ai.utaaa.io': 'home',
  'utaaa.io': 'home',
  'www.utaaa.io': 'home',
  'chat.utaaa.io': 'chat',
  'admin.utaaa.io': 'admin',
  'auth.utaaa.io': 'auth',
  'tako.ai.id': 'home',
  'www.tako.ai.id': 'home',
  'chat.tako.ai.id': 'chat',
  'admin.tako.ai.id': 'admin',
  'auth.tako.ai.id': 'auth',
  'tako.localhost': 'home',
  'www.tako.localhost': 'home',
  'chat.tako.localhost': 'chat',
  'admin.tako.localhost': 'admin',
  'auth.tako.localhost': 'auth',
  'ai.localhost': 'home',
  'chat.localhost': 'chat',
  'admin.localhost': 'admin',
  'auth.localhost': 'auth',
};

function normalizeHostname(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.startsWith('[')) return trimmed;
  const colonIndex = trimmed.indexOf(':');
  return colonIndex === -1 ? trimmed : trimmed.slice(0, colonIndex);
}

function resolveDomainBase(hostname: string): DomainBase | null {
  const host = normalizeHostname(hostname);
  if (host === 'utaaa.io' || host.endsWith('.utaaa.io')) {
    return { rootDomain: 'utaaa.io', homeHost: 'ai.utaaa.io' };
  }
  if (host === 'tako.ai.id' || host.endsWith('.tako.ai.id')) {
    return { rootDomain: 'tako.ai.id', homeHost: 'tako.ai.id' };
  }
  if (host === 'tako.localhost' || host.endsWith('.tako.localhost')) {
    return { rootDomain: 'tako.localhost', homeHost: 'tako.localhost' };
  }
  if (
    host === 'ai.localhost' ||
    host === 'chat.localhost' ||
    host === 'admin.localhost' ||
    host === 'auth.localhost'
  ) {
    return { rootDomain: 'localhost', homeHost: 'ai.localhost' };
  }
  return null;
}

function isPassthroughPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_app/') ||
    pathname.startsWith('/api/') ||
    STATIC_EXT_PATTERN.test(pathname)
  );
}

function hasPathPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function stripPathPrefix(pathname: string, prefix: string): string {
  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) {
    const rest = pathname.slice(prefix.length);
    return rest || '/';
  }
  return pathname || '/';
}

function ensureLeadingSlash(path: string): string {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function defaultPrefixForSite(site: SubdomainSite): string {
  if (site === 'home') return '/home';
  if (site === 'chat') return '/chat';
  if (site === 'admin') return '/admin';
  return '/login';
}

function isTrustedCrossSiteUrl(
  candidate: string,
  currentUrl: SiteUrlOrigin,
  base: DomainBase,
): string | null {
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    const targetSite = resolveSiteFromHostname(parsed.hostname);
    const targetBase = resolveDomainBase(parsed.hostname);
    const sameRoot = targetBase?.rootDomain === base.rootDomain;
    const samePort = (parsed.port || '') === (currentUrl.port || '');
    if (!sameRoot || !samePort || !targetSite || targetSite === 'auth') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function resolveSiteFromHostname(hostname: string): SubdomainSite | null {
  const host = normalizeHostname(hostname);
  return HOST_TO_SITE[host] ?? null;
}

// Memetakan URL eksternal subdomain ke rute internal SvelteKit tanpa mengubah URL di browser.
export function resolveSubdomainPathname(url: URL): string | undefined {
  const { pathname } = url;
  if (isPassthroughPath(pathname)) return undefined;

  const site = resolveSiteFromHostname(url.hostname);

  if (site === 'auth') {
    if (pathname === '/') return '/login';
    return undefined;
  }

  if (site === 'chat') {
    if (pathname === '/') return '/chat';
    return undefined;
  }

  if (site === 'admin') {
    if (pathname === '/') return '/admin';
    if (
      pathname === '/login' ||
      hasPathPrefix(pathname, '/admin') ||
      hasPathPrefix(pathname, '/chat') ||
      hasPathPrefix(pathname, '/home')
    ) {
      return undefined;
    }
    return `/admin${pathname}`;
  }

  // Untuk site 'home' dan akses lokal tanpa subdomain (localhost / IP), root '/' menuju '/home'.
  if (pathname === '/') return '/home';
  return undefined;
}

export function buildSiteUrl(
  targetSite: SubdomainSite,
  currentUrl: SiteUrlOrigin,
  path = '/',
): string {
  const normalizedPath = ensureLeadingSlash(path);
  const base = resolveDomainBase(currentUrl.hostname);

  if (!base) {
    const prefix = defaultPrefixForSite(targetSite);
    if (normalizedPath === '/') return prefix;
    if (normalizedPath.startsWith('/?')) return `${prefix}${normalizedPath.slice(1)}`;
    if (hasPathPrefix(normalizedPath, prefix)) return normalizedPath;
    if (targetSite === 'home' && normalizedPath === '/login') return '/login';
    return `${prefix}${normalizedPath}`;
  }

  const targetHost =
    targetSite === 'home' ? base.homeHost : `${targetSite}.${base.rootDomain}`;
  const port = currentUrl.port ? `:${currentUrl.port}` : '';
  return `${currentUrl.protocol}//${targetHost}${port}${normalizedPath}`;
}

export function buildSitePath(
  site: SubdomainSite,
  currentUrl: SiteHostRef,
  subPath = '/',
): string {
  const normalizedSubPath = ensureLeadingSlash(subPath);
  const activeSite = resolveSiteFromHostname(currentUrl.hostname);

  if (activeSite === site) {
    return normalizedSubPath;
  }

  const prefix = defaultPrefixForSite(site);
  return normalizedSubPath === '/' ? prefix : `${prefix}${normalizedSubPath}`;
}

export function normalizeSitePathname(
  site: SubdomainSite,
  pathname: string,
): string {
  return stripPathPrefix(pathname, defaultPrefixForSite(site));
}

export function buildAuthLoginUrl(
  currentUrl: SiteUrlOrigin,
  returnTarget?: string,
): string {
  const base = resolveDomainBase(currentUrl.hostname);
  if (!base) {
    if (
      returnTarget &&
      returnTarget.startsWith('/') &&
      !returnTarget.startsWith('//') &&
      returnTarget !== '/login'
    ) {
      return `/login?next=${encodeURIComponent(returnTarget)}`;
    }
    return '/login';
  }

  if (returnTarget && isTrustedCrossSiteUrl(returnTarget, currentUrl, base)) {
    return buildSiteUrl(
      'auth',
      currentUrl,
      `/?next=${encodeURIComponent(returnTarget)}`,
    );
  }
  return buildSiteUrl('auth', currentUrl, '/');
}

function isTeacherRole(userRole?: string): boolean {
  const normalized = userRole?.trim().toLowerCase();
  return normalized === 'teacher' || normalized === 'guru' || normalized === 'admin';
}

// Memvalidasi tujuan redirect pasca-login dengan allowlist domain dan peran akun.
export function resolveSafePostLoginTarget(
  currentUrl: SiteRedirectUrl,
  userRole?: string,
): string {
  const rawNext = currentUrl.searchParams.get('next')?.trim();
  const base = resolveDomainBase(currentUrl.hostname);
  const teacher = isTeacherRole(userRole);
  const defaultSite: Exclude<SubdomainSite, 'auth'> = teacher ? 'admin' : 'chat';

  if (rawNext && !rawNext.includes('\\') && !rawNext.startsWith('//')) {
    if (rawNext.startsWith('/')) {
      const pointsToAdmin = hasPathPrefix(rawNext, '/admin');
      if (teacher) {
        if (pointsToAdmin) {
          return base
            ? buildSiteUrl('admin', currentUrl, stripPathPrefix(rawNext, '/admin'))
            : rawNext;
        }
      } else if (!pointsToAdmin) {
        if (!base) {
          return rawNext === '/login' ? defaultPrefixForSite(defaultSite) : rawNext;
        }
        if (hasPathPrefix(rawNext, '/chat')) {
          return buildSiteUrl('chat', currentUrl, rawNext);
        }
        if (hasPathPrefix(rawNext, '/home')) {
          return buildSiteUrl('home', currentUrl, stripPathPrefix(rawNext, '/home'));
        }
      }
    } else if (base) {
      const trustedUrl = isTrustedCrossSiteUrl(rawNext, currentUrl, base);
      if (trustedUrl) {
        const targetSite = resolveSiteFromHostname(new URL(trustedUrl).hostname);
        if (teacher && targetSite === 'admin') return trustedUrl;
        if (!teacher && targetSite !== 'admin') return trustedUrl;
      }
    }
  }

  if (!base) {
    return defaultPrefixForSite(defaultSite);
  }
  return buildSiteUrl(defaultSite, currentUrl, '/');
}

function buildAuthRedirectFromSite(
  url: URL,
  returnSite: Exclude<SubdomainSite, 'auth'>,
): string {
  const params = new URLSearchParams(url.searchParams);
  if (!params.has('next')) {
    params.set('next', buildSiteUrl(returnSite, url, '/'));
  }
  return buildSiteUrl('auth', url, `/?${params.toString()}`);
}

const ROUTE_PREFIXES: ReadonlyArray<{
  prefix: string;
  targetSite: Exclude<SubdomainSite, 'auth'>;
}> = [
  { prefix: '/home', targetSite: 'home' },
  { prefix: '/chat', targetSite: 'chat' },
  { prefix: '/admin', targetSite: 'admin' },
];

// Menjaga isolasi domain dan mengarahkan semua rute login ke subdomain auth saat aktif.
export function resolveCanonicalRedirect(url: URL): string | null {
  const { pathname, search } = url;
  if (isPassthroughPath(pathname)) return null;

  const site = resolveSiteFromHostname(url.hostname);
  if (!site) return null;

  if (pathname === '/login') {
    if (site === 'auth') return `/${search}`;
    return buildAuthRedirectFromSite(url, site === 'admin' ? 'admin' : 'chat');
  }

  for (const { prefix, targetSite } of ROUTE_PREFIXES) {
    if (!hasPathPrefix(pathname, prefix)) continue;

    if (site === targetSite) {
      if (targetSite === 'chat') return null;
      return `${stripPathPrefix(pathname, prefix)}${search}`;
    }

    const nextPath =
      targetSite === 'chat'
        ? pathname === '/chat'
          ? '/'
          : pathname
        : stripPathPrefix(pathname, prefix);
    return `${buildSiteUrl(targetSite, url, nextPath)}${search}`;
  }

  return null;
}
