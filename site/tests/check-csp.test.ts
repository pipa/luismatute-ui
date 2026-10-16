import { describe, expect, it } from 'vitest';
import { cspProblems } from '../scripts/check-csp.mjs';

describe('check-csp', () => {
  it('passes external scripts and stylesheets', () => {
    expect(
      cspProblems(
        '<link rel="stylesheet" href="/a.css"><script type="module" src="/a.js"></script>',
      ),
    ).toEqual([]);
  });
  it('fails inline <style>, inline <script> and style=', () => {
    expect(cspProblems('<style>a{}</style>')).toEqual(['inline <style>']);
    expect(cspProblems('<script>alert(1)</script>')).toEqual([
      'inline <script>',
    ]);
    expect(cspProblems('<script src="/a.js">x()</script>')).toEqual([
      'inline <script>',
    ]);
    expect(cspProblems('<p style="color:red">x</p>')).toEqual([
      'style= attribute',
    ]);
  });
  it('does not flag the word style in text or data-style', () => {
    expect(cspProblems('<p data-style-x="1">style= is banned</p>')).toEqual([]);
  });
});
