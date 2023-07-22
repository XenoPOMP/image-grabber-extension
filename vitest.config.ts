import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  // @ts-ignore
  viteConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, 'packages/template/*'],
      coverage: {
        reporter: ['text', 'json-summary', 'json'],
        provider: 'istanbul'
      }
    }
  })
);
