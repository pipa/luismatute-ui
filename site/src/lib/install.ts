import pkg from '../../../package.json';

/** Package name and tag the install snippets use, read from package.json. */
export const pkgName = pkg.name;
export const tag = `v${pkg.version}`;
export const repo = 'github:pipa/luismatute-ui';
export const installCmd = `pnpm add ${repo}#${tag}`;
