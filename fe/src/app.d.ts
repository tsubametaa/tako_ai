import type { SubdomainSite } from '$lib/shared/config/subdomains';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      site: SubdomainSite | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
