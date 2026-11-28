export type SubdomainSite = 'home' | 'chat' | 'admin' | 'auth';

export type SiteUrlOrigin = Pick<URL, 'hostname' | 'protocol' | 'port'>;
export type SiteHostRef = Pick<URL, 'hostname'>;
export type SiteRedirectUrl = Pick<URL, 'hostname' | 'protocol' | 'port' | 'pathname'> & {
  readonly searchParams: Pick<URLSearchParams, 'get'>;
};

interface DomainBase {
  rootDomain: string;
  homeHost: string;
  unifiedHomeAuthAdmin?: boolean;
}

const STATIC_EXT_PATTERN =
  /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|mjs|png|svg|txt|webmanifest|webp|woff|woff2|xml)$/i;

const HOST_TO_SITE: Record<string, SubdomainSite> = {
  'ai.utaaa.io': 'home',
  'utaaa.io': 'home',
  'www.utaaa.io': 'home',
  'chat.utaaa.io': 'chat',
  'neko.ai.id': 'home',
  'www.neko.ai.id': 'home',
  'chat.neko.ai.id': 'chat',
  'admin.neko.ai.id': 'admin',
  'auth.neko.ai.id': 'auth',
  'neko.localhost': 'home',
  'www.neko.localhost': 'home',
  'chat.neko.localhost': 'chat',
  'admin.neko.localhost': 'admin',
  'auth.neko.localhost': 'auth',
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
    return { rootDomain: 'utaaa.io', homeHost: 'ai.utaaa.io', unifiedHomeAuthAdmin: true };
  }
  if (host === 'neko.ai.id' || host.endsWith('.neko.ai.id')) {
    return { rootDomain: 'neko.ai.id', homeHost: 'neko.ai.id' };
  }
  if (host === 'neko.localhost' || host.endsWith('.neko.localhost')) {
    return { rootDomain: 'neko.localhost', homeHost: 'neko.localhost' };
  }
  if (['ai.localhost', 'chat.localhost', 'admin.localhost', 'auth.localhost'].includes(host)) {
    return { rootDomain: 'localhost', homeHost: 'ai.localhost' };
  }
  return null;
}

function isPassthroughPath(pathname: string): boolean {
  return pathname.startsWith('/_app/') || pathname.startsWith('/api/') || STATIC_EXT_PATTERN.test(pathname);
}

function hasPathPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function stripPathPrefix(pathname: string, prefix: string): string {
  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || '/';
  return pathname || '/';
}

function ensureLeadingSlash(path: string): string {
  return !path ? '/' : path.startsWith('/') ? path : `/${path}`;
}

function defaultPrefixForSite(site: SubdomainSite, base?: DomainBase | null): string {
  if (site === 'home') return '/home';
  if (site === 'chat') return '/chat';
  if (site === 'admin') return '/admin';
  return base?.unifiedHomeAuthAdmin ? '/auth' : '/login';
}

function buildPrefixedPath(prefix: string, normalizedPath: string): string {
  if (normalizedPath === '/') return prefix;
  if (normalizedPath.startsWith('/?')) return `${prefix}${normalizedPath.slice(1)}`;
  return hasPathPrefix(normalizedPath, prefix) ? normalizedPath : `${prefix}${normalizedPath}`;
}

function isAuthPathOnUnifiedHome(pathname: string, base: DomainBase): boolean {
  return Boolean(base.unifiedHomeAuthAdmin && (hasPathPrefix(pathname, '/auth') || pathname === '/login'));
}

function isAdminPathOnUnifiedHome(pathname: string, base: DomainBase): boolean {
  return Boolean(base.unifiedHomeAuthAdmin && hasPathPrefix(pathname, '/admin'));
}

function isTrustedCrossSiteUrl(candidate: string, currentUrl: SiteUrlOrigin, base: DomainBase): string | null {
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    const targetSite = resolveSiteFromHostname(parsed.hostname);
    const sameRoot = resolveDomainBase(parsed.hostname)?.rootDomain === base.rootDomain;
    const samePort = (parsed.port || '') === (currentUrl.port || '');
    if (!sameRoot || !samePort || !targetSite || targetSite === 'auth' || isAuthPathOnUnifiedHome(parsed.pathname, base)) {
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
  const base = resolveDomainBase(url.hostname);

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

  // Untuk domain terpadu (ai.utaaa.io), /auth memetakan ke rute internal /login.
  if (site === 'home' && base?.unifiedHomeAuthAdmin && pathname === '/auth') {
    return '/login';
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
    if (targetSite === 'home' && normalizedPath === '/login') return '/login';
    return buildPrefixedPath(prefix, normalizedPath);
  }

  const port = currentUrl.port ? `:${currentUrl.port}` : '';
  if (base.unifiedHomeAuthAdmin && (targetSite === 'auth' || targetSite === 'admin')) {
    const prefix = defaultPrefixForSite(targetSite, base);
    const unifiedPath = buildPrefixedPath(prefix, normalizedPath);
    return `${currentUrl.protocol}//${base.homeHost}${port}${unifiedPath}`;
  }

  const targetHost =
    targetSite === 'home' ? base.homeHost : `${targetSite}.${base.rootDomain}`;
  return `${currentUrl.protocol}//${targetHost}${port}${normalizedPath}`;
}

export function buildSitePath(
  site: SubdomainSite,
  currentUrl: SiteHostRef,
  subPath = '/',
): string {
  const normalizedSubPath = ensureLeadingSlash(subPath);
  const activeSite = resolveSiteFromHostname(currentUrl.hostname);
  const base = resolveDomainBase(currentUrl.hostname);

  if (activeSite === site && !(base?.unifiedHomeAuthAdmin && (site === 'auth' || site === 'admin'))) {
    return normalizedSubPath;
  }

  const prefix = defaultPrefixForSite(site, base);
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

  const port = currentUrl.port ? `:${currentUrl.port}` : '';
  const absoluteCandidate =
    returnTarget && returnTarget.startsWith('/') && !returnTarget.startsWith('//')
      ? `${currentUrl.protocol}//${currentUrl.hostname}${port}${returnTarget}`
      : returnTarget;

  if (absoluteCandidate && isTrustedCrossSiteUrl(absoluteCandidate, currentUrl, base)) {
    return buildSiteUrl(
      'auth',
      currentUrl,
      `/?next=${encodeURIComponent(absoluteCandidate)}`,
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
      } else if (!pointsToAdmin && rawNext !== '/login' && !hasPathPrefix(rawNext, '/auth')) {
        if (!base) {
          return rawNext;
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
        const parsed = new URL(trustedUrl);
        const targetSite = resolveSiteFromHostname(parsed.hostname);
        const pointsToAdmin =
          targetSite === 'admin' || isAdminPathOnUnifiedHome(parsed.pathname, base);
        if (teacher && pointsToAdmin) return trustedUrl;
        if (!teacher && !pointsToAdmin) return trustedUrl;
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

// Menjaga isolasi domain dan mengarahkan semua rute login ke lokasi auth aktif.
export function resolveCanonicalRedirect(url: URL): string | null {
  const { pathname, search } = url;
  if (isPassthroughPath(pathname)) return null;

  const base = resolveDomainBase(url.hostname);
  const site = resolveSiteFromHostname(url.hostname);

  if (!site) {
    if (base?.unifiedHomeAuthAdmin) {
      const host = normalizeHostname(url.hostname);
      if (host === `auth.${base.rootDomain}`) {
        return `${buildSiteUrl('auth', url, '/')}${search}`;
      }
      if (host === `admin.${base.rootDomain}`) {
        return `${buildSiteUrl('admin', url, pathname)}${search}`;
      }
    }
    return null;
  }

  if (pathname === '/login' || (base?.unifiedHomeAuthAdmin && hasPathPrefix(pathname, '/auth'))) {
    if (site === 'auth') return `/${search}`;
    if (base?.unifiedHomeAuthAdmin && site === 'home') {
      return pathname === '/login' ? `/auth${search}` : null;
    }
    return buildAuthRedirectFromSite(url, site === 'admin' ? 'admin' : 'chat');
  }

  for (const { prefix, targetSite } of ROUTE_PREFIXES) {
    if (!hasPathPrefix(pathname, prefix)) continue;

    if (base?.unifiedHomeAuthAdmin && targetSite === 'admin') {
      if (site === 'home') return null;
      return `${buildSiteUrl('admin', url, stripPathPrefix(pathname, prefix))}${search}`;
    }

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
