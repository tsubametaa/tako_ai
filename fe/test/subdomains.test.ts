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
    assert.equal(resolveSiteFromHostname('admin.utaaa.io'), null);
    assert.equal(resolveSiteFromHostname('auth.utaaa.io'), null);
    assert.equal(resolveSiteFromHostname('neko.ai.id'), 'home');
    assert.equal(resolveSiteFromHostname('www.neko.ai.id'), 'home');
    assert.equal(resolveSiteFromHostname('chat.neko.ai.id'), 'chat');
    assert.equal(resolveSiteFromHostname('admin.neko.ai.id'), 'admin');
    assert.equal(resolveSiteFromHostname('auth.neko.ai.id'), 'auth');
    assert.equal(resolveSiteFromHostname('neko.localhost'), 'home');
    assert.equal(resolveSiteFromHostname('chat.neko.localhost'), 'chat');
    assert.equal(resolveSiteFromHostname('admin.neko.localhost'), 'admin');
    assert.equal(resolveSiteFromHostname('auth.neko.localhost'), 'auth');
    assert.equal(resolveSiteFromHostname('localhost'), null);
    assert.equal(resolveSiteFromHostname('127.0.0.1'), null);
  });

  it('reroutes root and nested paths per subdomain without mutating assets or api', () => {
    assert.equal(
      resolveSubdomainPathname(new URL('https://neko.ai.id/')),
      '/home',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://auth.neko.ai.id/')),
      '/login',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://chat.neko.ai.id/')),
      '/chat',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://chat.neko.ai.id/chat/room-1')),
      undefined,
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://admin.neko.ai.id/')),
      '/admin',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://admin.neko.ai.id/materi')),
      '/admin/materi',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://auth.neko.ai.id/api/v1/health')),
      undefined,
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://admin.neko.ai.id/favicon.svg')),
      undefined,
    );
    assert.equal(
      resolveSubdomainPathname(new URL('http://localhost:1234/')),
      '/home',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://ai.utaaa.io/auth')),
      '/login',
    );
    assert.equal(
      resolveSubdomainPathname(new URL('https://ai.utaaa.io/admin/materi')),
      undefined,
    );
  });

  it('redirects cross-domain routes and /login to canonical subdomain hosts', () => {
    assert.equal(
      resolveCanonicalRedirect(new URL('https://ai.utaaa.io/auth')),
      null,
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://ai.utaaa.io/login?expired=true')),
      '/auth?expired=true',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://ai.utaaa.io/admin/materi')),
      null,
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://chat.utaaa.io/login?expired=true')),
      'https://ai.utaaa.io/auth?expired=true&next=https%3A%2F%2Fchat.utaaa.io%2F',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://chat.utaaa.io/admin/materi')),
      'https://ai.utaaa.io/admin/materi',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://neko.ai.id/')),
      null,
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://auth.neko.ai.id/')),
      null,
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://auth.neko.ai.id/login?expired=true')),
      '/?expired=true',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://auth.neko.ai.id/chat/demo-1')),
      'https://chat.neko.ai.id/chat/demo-1',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://neko.ai.id/home')),
      '/',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://neko.ai.id/chat')),
      'https://chat.neko.ai.id/',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://neko.ai.id/login')),
      'https://auth.neko.ai.id/?next=https%3A%2F%2Fchat.neko.ai.id%2F',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://chat.neko.ai.id/login?expired=true')),
      'https://auth.neko.ai.id/?expired=true&next=https%3A%2F%2Fchat.neko.ai.id%2F',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://admin.neko.ai.id/login')),
      'https://auth.neko.ai.id/?next=https%3A%2F%2Fadmin.neko.ai.id%2F',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://chat.neko.ai.id/admin/materi')),
      'https://admin.neko.ai.id/materi',
    );
    assert.equal(
      resolveCanonicalRedirect(new URL('https://admin.neko.ai.id/admin/audit')),
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
    assert.equal(buildSiteUrl('admin', utaaaHome), 'https://ai.utaaa.io/admin');
    assert.equal(buildSiteUrl('auth', utaaaHome), 'https://ai.utaaa.io/auth');
    assert.equal(
      buildAuthLoginUrl(new URL('https://chat.utaaa.io/chat/room-1'), '/chat/room-1'),
      'https://ai.utaaa.io/auth?next=https%3A%2F%2Fchat.utaaa.io%2Fchat%2Froom-1',
    );

    const prodHome = new URL('https://neko.ai.id/');
    assert.equal(buildSiteUrl('chat', prodHome), 'https://chat.neko.ai.id/');
    assert.equal(buildSiteUrl('admin', prodHome), 'https://admin.neko.ai.id/');
    assert.equal(buildSiteUrl('auth', prodHome), 'https://auth.neko.ai.id/');
    assert.equal(
      buildAuthLoginUrl(prodHome, 'https://admin.neko.ai.id/materi'),
      'https://auth.neko.ai.id/?next=https%3A%2F%2Fadmin.neko.ai.id%2Fmateri',
    );

    const localSub = new URL('http://chat.neko.localhost:1234/');
    assert.equal(
      buildSiteUrl('auth', localSub),
      'http://auth.neko.localhost:1234/',
    );

    const plainLocal = new URL('http://localhost:1234/');
    assert.equal(buildSiteUrl('chat', plainLocal), '/chat');
    assert.equal(buildSiteUrl('auth', plainLocal), '/login');
    assert.equal(
      buildAuthLoginUrl(plainLocal, '/admin/materi'),
      '/login?next=%2Fadmin%2Fmateri',
    );

    assert.equal(
      buildSitePath('admin', new URL('https://admin.neko.ai.id/'), '/materi'),
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
        new URL('https://ai.utaaa.io/auth?next=https%3A%2F%2Fchat.utaaa.io%2F'),
        'teacher',
      ),
      'https://ai.utaaa.io/admin',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://ai.utaaa.io/auth?next=https%3A%2F%2Fai.utaaa.io%2Fadmin%2Fmateri'),
        'teacher',
      ),
      'https://ai.utaaa.io/admin/materi',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://ai.utaaa.io/auth?next=https%3A%2F%2Fai.utaaa.io%2Fadmin%2Fmateri'),
        'student',
      ),
      'https://chat.utaaa.io/',
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
        new URL('https://auth.neko.ai.id/?next=https%3A%2F%2Fadmin.neko.ai.id%2Fmateri'),
        'teacher',
      ),
      'https://admin.neko.ai.id/materi',
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
        new URL('https://auth.neko.ai.id/?next=https%3A%2F%2Fadmin.neko.ai.id%2Fmateri'),
        'student',
      ),
      'https://chat.neko.ai.id/',
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
        new URL('https://auth.neko.ai.id/?next=https%3A%2F%2Fevil.example%2Fphish'),
        'student',
      ),
      'https://chat.neko.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.neko.ai.id/?next=//evil.example'),
        'teacher',
      ),
      'https://admin.neko.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(
        new URL('https://auth.neko.ai.id/?next=https%3A%2F%2Fauth.neko.ai.id%2F'),
        'student',
      ),
      'https://chat.neko.ai.id/',
    );
    assert.equal(
      resolveSafePostLoginTarget(new URL('https://auth.neko.ai.id/'), 'guru'),
      'https://admin.neko.ai.id/',
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
