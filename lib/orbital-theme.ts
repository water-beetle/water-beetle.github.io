import { defineTheme, generateThemeCSS } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
export const orbitalTheme = defineTheme({
  name: 'orbital',
  extends: neutralTheme,
  tokens: {
    '--color-accent': '#b7e6d8',
    '--color-on-accent': '#0a1715',
    '--color-accent-muted': '#b7e6d81a',
    '--color-background-body': '#080d14',
    '--color-background-surface': '#101923',
    '--color-background-card': '#101923',
    '--color-background-popover': '#15202c',
    '--color-text-primary': '#edf1f4',
    '--color-text-secondary': '#a4b0bf',
    '--color-text-accent': '#b7e6d8',
    '--color-icon-accent': '#b7e6d8',
    '--color-icon-primary': '#edf1f4',
  },
});
const css = generateThemeCSS(orbitalTheme);
export const orbitalThemeCSS = `@layer reset {${css.prose}} @layer astryx-theme {${css.component}}`;
