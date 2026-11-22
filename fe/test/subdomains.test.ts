import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildAuthLoginUrl,
  buildSitePath,
  buildSiteUrl,
  normalizeSitePathname,
  resolveCanonicalRedirect,
  resolveSafePostLoginTarget,
  resolveSiteFromHostname,
  resolveSubdomainPathname,
} from '../src/lib/shared/config/subdomains.ts';

describe('subdomain routing config', () => {
  it('resolves production and local subdomain hostnames including auth', () => {
    assert.equal(resolveSiteFromHostname('ai.utaaa.io'), 'home');
    assert.equal(resolveSiteFromHostname('chat.utaaa.io'), 'chat');
    assert.equal(resolveSiteFromHostname('admin.utaaa.io'), 'admin');
    assert.equal(resolveSiteFromHostname('auth.utaaa.io'), 'auth');
    assert.equal(resolveSiteFromHostname('tako.ai.id'), 'home');
    assert.equal(resolveSiteFromHostname('www.tako.ai.id'), 'home');
    assert.equal(resolveSiteFromHostname('chat.tako.ai.id'), 'chat');
    assert.equal(resolveSiteFromHostname('admin.tako.ai.id'), 'admin');
    assert.equal(resolveSiteFromHostname('auth.tako.ai.id'), 'auth');
    assert.equal(resolveSiteFromHostname('tako.localhost'), 'home');
    assert.equal(resolveSiteFromHostname('chat.tako.localhost'), 'chat');
    assert.equal(resolveSiteFromHostname('admin.tako.localhost'), 'admin');
    assert.equal(resolveSiteFromHostname('auth.tako.localhost'), 'auth');
    assert.equal(resolveSiteFromHostname('localhost'), null);
    assert.equal(resolveSiteFromHostname('127.0.0.1'), null);
  });

  it('reroutes root and nested paths per subdomain without mutating assets or api', () => {
    assert.equal(
      resolveSubdomainPathname(new URL('https://tako.ai.id/')),
      '/home',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://auth.tako.ai.id/')),
      '/login',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://chat.tako.ai.id/')),
      '/chat',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://chat.tako.ai.id/chat/room-1')),
      undefined,
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://admin.tako.ai.id/')),
      '/admin',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://admin.tako.ai.id/materi')),
      '/admin/materi',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://auth.tako.ai.id/api/v1/health')),
      undefined,
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://admin.tako.ai.id/favicon.svg')),
      undefined,
    );
    assert.equal(
      resolveSubdomainPathname(new URL('http://localhost:1234/')),
      '/home',
    );
  });

  it('redirects cross-domain routes and /login to canonical subdomain hosts', () => {
    assert.equal(
      resolveCanonicalRedirect(new URL('https://tako.ai.id/')),
      null,
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://auth.tako.ai.id/')),
      null,
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://auth.tako.ai.id/login?expired=true')),
      '/?expired=true',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://auth.tako.ai.id/chat/demo-1')),
      'https://chat.tako.ai.id/chat/demo-1',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://tako.ai.id/home')),
      '/',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://tako.ai.id/chat')),
      'https://chat.tako.ai.id/',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://tako.ai.id/login')),
      'https://auth.tako.ai.id/?next=https%3A%2F%2Fchat.tako.ai.id%2F',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://chat.tako.ai.id/login?expired=true')),
      'https://auth.tako.ai.id/?expired=true&next=https%3A%2F%2Fchat.tako.ai.id%2F',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://admin.tako.ai.id/login')),
      'https://auth.tako.ai.id/?next=https%3A%2F%2Fadmin.tako.ai.id%2F',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://chat.tako.ai.id/admin/materi')),
      'https://admin.tako.ai.id/materi',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://admin.tako.ai.id/admin/audit')),
      '/audit',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('http://localhost:1234/login')),
      null,
    );
  });

  it('builds cross-site and auth login URLs for subdomain and localhost modes', () => {
    const utaaaHome = new URL('https://ai.utaaa.io/');
    assert.equal(buildSiteUrl('home', utaaaHome), 'https://ai.utaaa.io/');
    assert.equal(buildSiteUrl('chat', utaaaHome), 'https://chat.utaaa.io/');
    assert.equal(buildSiteUrl('admin', utaaaHome), 'https://admin.utaaa.io/');
    assert.equal(buildSiteUrl('auth', utaaaHome), 'https://auth.utaaa.io/');

    const prodHome = new URL('https://tako.ai.id/');
    assert.equal(buildSiteUrl('chat', prodHome), 'https://chat.tako.ai.id/');
    assert.equal(buildSiteUrl('admin', prodHome), 'https://admin.tako.ai.id/');
    assert.equal(buildSiteUrl('auth', prodHome), 'https://auth.tako.ai.id/');
    assert.equal(
      buildAuthLoginUrl(prodHome, 'https://admin.tako.ai.id/materi'),
      'https://auth.tako.ai.id/?next=https%3A%2F%2Fadmin.tako.ai.id%2Fmateri',
    );

    const localSub = new URL('http://chat.tako.localhost:1234/');
    assert.equal(
      buildSiteUrl('auth', localSub),
      'http://auth.tako.localhost:1234/',
    );

    const plainLocal = new URL('http://localhost:1234/');
    assert.equal(buildSiteUrl('chat', plainLocal), '/chat');
    assert.equal(buildSiteUrl('auth', plainLocal), '/login');
    assert.equal(
      buildAuthLoginUrl(plainLocal, '/admin/materi'),
      '/login?next=%2Fadmin%2Fmateri',
    );

    assert.equal(
      buildSitePath('admin', new URL('https://admin.tako.ai.id/'), '/materi'),
      '/materi',
    );
    assert.equal(
      buildSitePath('admin', plainLocal, '/materi'),
      '/admin/materi',
    );
    assert.equal(normalizeSitePathname('admin', '/admin/materi'), '/materi');
  });

  it('validates post-login redirect targets with strict domain allowlist and role rules', () => {
    // Guru/teacher goes directly to admin dashboard even when next points to chat
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.utaaa.io/?next=https%3A%2F%2Fchat.utaaa.io%2F'),
        'teacher',
      ),
      'https://admin.utaaa.io/',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('http://localhost:1234/login?next=%2Fchat'),
        'guru',
      ),
      '/admin',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.tako.ai.id/?next=https%3A%2F%2Fadmin.tako.ai.id%2Fmateri'),
        'teacher',
      ),
      'https://admin.tako.ai.id/materi',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('http://localhost:1234/login?next=/admin/materi'),
        'guru',
      ),
      '/admin/materi',
    );

    // Student cannot be redirected to admin even if next points to /admin
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.tako.ai.id/?next=https%3A%2F%2Fadmin.tako.ai.id%2Fmateri'),
        'student',
      ),
      'https://chat.tako.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('http://localhost:1234/login?next=/admin/materi'),
        'student',
      ),
      '/chat',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.tako.ai.id/?next=https%3A%2F%2Fevil.example%2Fphish'),
        'student',
      ),
      'https://chat.tako.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.tako.ai.id/?next=//evil.example'),
        'teacher',
      ),
      'https://admin.tako.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.tako.ai.id/?next=https%3A%2F%2Fauth.tako.ai.id%2F'),
        'student',
      ),
      'https://chat.tako.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(new URL('https://auth.tako.ai.id/'), 'guru'),
      'https://admin.tako.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('http://localhost:1234/login'),
        'teacher',
      ),
      '/admin',
    );
  });
});
