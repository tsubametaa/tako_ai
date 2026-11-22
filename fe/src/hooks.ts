import type { Reroute } from '@sveltejs/kit/hooks';
import { resolveSubdomainPathname } from '$lib/shared/config/subdomains';

export const reroute: Reroute = ({ url }) => resolveSubdomainPathname(url);
