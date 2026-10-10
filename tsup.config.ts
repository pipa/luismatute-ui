import { defineConfig } from 'tsup';

const entries = [
  'src/index.ts',
  'src/tokens/index.ts',
  'src/components/index.ts',
  'src/components/card.ts',
  'src/components/chip.ts',
  'src/components/more.ts',
  'src/components/motion-toggle.ts',
  'src/components/pause.ts',
  'src/components/shot.ts',
  'src/components/avatar.ts',
  'src/components/globe.ts',
  'src/components/flight-plan.ts',
  'src/illustrations/index.ts',
];

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
