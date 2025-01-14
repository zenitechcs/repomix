import { defineConfig } from 'vitepress';
import { configShard } from './config/configShard';
import { configEn } from './config/configEn';
import { configJa } from './config/configJa';

export default defineConfig({
  ...configShard,
  locales: {
    root: { label: 'English', ...configEn },
    ja: { label: '日本語', ...configJa },
  },
});
