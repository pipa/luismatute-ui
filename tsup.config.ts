import { defineConfig } from 'tsup';

const entries = {
  index: 'src/index.ts',
  'tokens/index': 'src/tokens/index.ts',
  'components/index': 'src/components/entries/index.ts',
  'components/card': 'src/components/entries/card.ts',
  'components/chip': 'src/components/entries/chip.ts',
  'components/more': 'src/components/entries/more.ts',
  'components/motion-toggle': 'src/components/entries/motion-toggle.ts',
  'components/pause': 'src/components/entries/pause.ts',
  'components/shot': 'src/components/entries/shot.ts',
  'components/avatar': 'src/components/entries/avatar.ts',
  'components/globe': 'src/components/entries/globe.ts',
  'components/flight-plan': 'src/components/entries/flight-plan.ts',
  'components/theme-toggle': 'src/components/entries/theme-toggle.ts',
  'components/sky-header': 'src/components/entries/sky-header.ts',
  'theme-init': 'src/theme-init.ts',
  'illustrations/index': 'src/illustrations/index.ts',
};

export default defineConfig({
  entry: entries,
  format: ['esm'],
  dts: false,
  clean: false,
  splitting: false,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  treeshake: true,
  outExtension: () => ({ js: '.js' }),
});
