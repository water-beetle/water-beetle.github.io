import { defineTheme, generateThemeCSS } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
export const orbitalTheme = defineTheme({
  name: 'orbital',
  extends: neutralTheme,
  tokens: {
    '--color-accent': '#efab75',
    '--color-on-accent': '#191b17',
    '--color-accent-muted': '#efab751a',
    '--color-background-body': '#111315',
    '--color-background-surface': '#1a1e1c',
    '--color-background-card': '#1a1e1c',
    '--color-background-popover': '#202620',
    '--color-text-primary': '#eeebe4',
    '--color-text-secondary': '#b4b8ac',
    '--color-text-accent': '#efab75',
    '--color-icon-accent': '#efab75',
    '--color-icon-primary': '#eeebe4',
  },
});
const css = generateThemeCSS(orbitalTheme);
export const orbitalThemeCSS = `@layer reset {${css.prose}} @layer astryx-theme {${css.component}}`;
