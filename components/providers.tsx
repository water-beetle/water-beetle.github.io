'use client';
import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { InternationalizationProvider } from '@astryxdesign/core/i18n';
import koKR from '@astryxdesign/core/locales/ko-KR.generated.js';
export function Providers({children}: {children: React.ReactNode}) {
  return <InternationalizationProvider locale="ko-KR" messages={{'ko-KR':koKR}}><Theme theme={neutralTheme} mode="dark">{children}</Theme></InternationalizationProvider>;
}
