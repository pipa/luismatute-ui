import { afterEach, describe, expect, it } from 'vitest';
import {
  readTheme,
  readThemeCookie,
  THEME_KEY,
  themeCookieConfig,
  themeCookieString,
} from '../src/components/theme.ts';

const prod = { hostname: 'blog.luismatute.me', protocol: 'https:' };

function tag(attrs: Record<string, string>): Element {
  const s = document.createElement('script');
  s.setAttribute('data-lm-theme', '');
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  return s;
}

afterEach(() => {
  localStorage.clear();
  document.cookie = 'lm-mode=; Max-Age=0; Path=/';
});

describe('lm-mode cookie', () => {
  it('prod string: parent domain, Secure, Lax, a year', () => {
    expect(themeCookieString('night', themeCookieConfig(null, prod))).toBe(
      'lm-mode=night; Path=/; Max-Age=31536000; SameSite=Lax; Domain=.luismatute.me; Secure',
    );
    expect(
      themeCookieConfig(null, {
        hostname: 'luismatute.me',
        protocol: 'https:',
      }),
    ).toEqual({ domain: '.luismatute.me', secure: true });
  });

  it('domain and Secure come from the script tag; foreign hosts go host-only', () => {
    const t = tag({ 'data-cookie-domain': '.lm.test' });
    expect(
      themeCookieConfig(t, { hostname: 'blog.lm.test', protocol: 'http:' }),
    ).toEqual({ domain: '.lm.test', secure: false });
    expect(
      themeCookieConfig(tag({ 'data-cookie-secure': 'false' }), prod).secure,
    ).toBe(false);
    expect(
      themeCookieConfig(null, { hostname: '127.0.0.1', protocol: 'http:' }),
    ).toEqual({ domain: null, secure: false });
    expect(
      themeCookieConfig(null, {
        hostname: 'evilluismatute.me',
        protocol: 'https:',
      }).domain,
    ).toBeNull();
  });

  it('reads day/night/auto; anything else is null, never a throw', () => {
    expect(readThemeCookie('a=1; lm-mode=night')).toBe('night');
    expect(readThemeCookie('lm-mode=auto')).toBe('auto');
    for (const bad of [
      'lm-mode=dark',
      'lm-mode=',
      'lm-mode=%E0%A4%A',
      'xlm-mode=night',
      '',
      ';;=',
    ])
      expect(readThemeCookie(bad)).toBeNull();
  });

  it('cookie beats storage; invalid cookie falls back to storage', () => {
    localStorage.setItem(THEME_KEY, 'day');
    document.cookie = 'lm-mode=night; Path=/';
    expect(readTheme('')).toBe('night');
    document.cookie = 'lm-mode=purple; Path=/';
    expect(readTheme('')).toBe('day');
    expect(readTheme('?mode=night')).toBe('night');
  });
});
