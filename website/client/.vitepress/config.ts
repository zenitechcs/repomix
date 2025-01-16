import { defineConfig } from 'vitepress';
import { configShard } from './config/configShard';
import { configEnUs } from './config/configEnUs';
import { configJa } from './config/configJa';
import { configZhCn } from './config/configZhCn';
import { configKo } from './config/configKo';
import { configEs } from './config/configEs';

export default defineConfig({
  ...configShard,
  locales: {
    root: { label: 'English', ...configEnUs },
    'zh-cn': { label: '简体中文', ...configZhCn },
    ja: { label: '日本語', ...configJa },
    es: { label: 'Español', ...configEs },
    ko: { label: '한국어', ...configKo },
  },
});
