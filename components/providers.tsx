'use client';
import { Theme } from '@astryxdesign/core/theme';
import { InternationalizationProvider } from '@astryxdesign/core/i18n';
import koKR from '@astryxdesign/core/locales/ko-KR.generated.js';
import { MotionConfig } from 'motion/react';
import { orbitalTheme, orbitalThemeCSS } from '@/lib/orbital-theme';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{orbitalThemeCSS}</style>
      <InternationalizationProvider locale="ko-KR" messages={{ 'ko-KR': koKR }}>
        <Theme theme={orbitalTheme} mode="dark">
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </Theme>
      </InternationalizationProvider>
    </>
  );
}
