"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LOG_ENDPOINT = 'http://127.0.0.1:7242/ingest/152a03b4-1b30-432f-80a9-ab4335a4a01b';

function sendLog(payload: Record<string, unknown>) {
  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      timestamp: Date.now(),
      sessionId: 'debug-session',
    }),
  }).catch(() => {});
}

export default function LayoutStripDebug() {
  const pathname = usePathname();
  useEffect(() => {
    const t = setTimeout(() => {
      // #region agent log
      const body = document.body;
      const firstHeader = document.querySelector('header');
      const headers = document.querySelectorAll('header');
      const lastHeader = headers.length ? headers[headers.length - 1] : null;
      const main = document.querySelector('main');
      const firstSection = document.querySelector('main section, main > section, section.tp-sign-in-ptb, section.tp-property-ptb, section.tp-hero-ptb');
      const offcanvasArea = document.querySelector('.offcanvas__area');
      const bodyOverlay = document.querySelector('.body-overlay');

      const bodyStyle = body ? getComputedStyle(body) : null;
      const headerStyle = firstHeader ? getComputedStyle(firstHeader) : null;
      const mainStyle = main ? getComputedStyle(main) : null;
      const sectionStyle = firstSection ? getComputedStyle(firstSection) : null;

      const headerRect = firstHeader?.getBoundingClientRect();
      const lastHeaderRect = lastHeader?.getBoundingClientRect();
      const mainRect = main?.getBoundingClientRect();
      const sectionRect = firstSection?.getBoundingClientRect();

      const firstContent = main ?? firstSection;
      const firstContentRect = firstContent?.getBoundingClientRect();
      const firstContentPrev = firstContent?.previousElementSibling;
      const headerBottom = lastHeaderRect?.bottom ?? headerRect?.bottom;
      const gapPx = firstContentRect && headerBottom != null ? Math.round(firstContentRect.top - headerBottom) : null;

      const domChain: string[] = [];
      let node: Element | null = body?.firstElementChild ?? null;
      for (let i = 0; i < 12 && node; i++) {
        domChain.push(`${node.tagName}${node.className ? '.' + (node.className as string).trim().split(/\s+/).slice(0, 2).join('.') : ''}`);
        node = node.nextElementSibling;
      }

      sendLog({
        hypothesisId: 'H6_H9',
        location: 'LayoutStripDebug.tsx:DOM structure',
        message: 'DOM order and first content prev sibling',
        data: {
          runId: 'round2',
          domChainFirst12: domChain,
          mainPrevSiblingTag: main?.previousElementSibling?.tagName ?? null,
          mainPrevSiblingClass: (main?.previousElementSibling as HTMLElement)?.className?.slice(0, 80) ?? null,
          sectionPrevSiblingTag: firstSection?.previousElementSibling?.tagName ?? null,
          firstContentTag: firstContent?.tagName ?? null,
          firstContentPrevTag: firstContentPrev?.tagName ?? null,
        },
      });

      sendLog({
        hypothesisId: 'H7',
        location: 'LayoutStripDebug.tsx:computed margin',
        message: 'Computed marginTop applied',
        data: {
          runId: 'round2',
          mainComputedMarginTop: mainStyle?.marginTop,
          sectionComputedMarginTop: sectionStyle?.marginTop,
          mainRectTop: mainRect?.top,
          sectionRectTop: sectionRect?.top,
          headerRectBottom: lastHeaderRect?.bottom,
          gapPx,
        },
      });

      sendLog({
        hypothesisId: 'H8',
        location: 'LayoutStripDebug.tsx:strip position',
        message: 'Strip above header or between header and content',
        data: {
          runId: 'round2',
          firstHeaderTop: headerRect?.top,
          firstChildOfBodyTop: body?.firstElementChild?.getBoundingClientRect?.()?.top,
          scrollY: typeof window !== 'undefined' ? window.scrollY : null,
          gapPx,
        },
      });

      sendLog({
        hypothesisId: 'H4',
        location: 'LayoutStripDebug.tsx:useEffect',
        message: 'Header/wrapper gap',
        data: {
          runId: 'post-fix-2',
          headerRectBottom: lastHeaderRect?.bottom,
          mainRectTop: mainRect?.top,
          sectionRectTop: sectionRect?.top,
          gapPx,
        },
      });

      const isHome = pathname === '/';
      const heroHome = document.querySelector('.tp-hero-ptb.tp-hero-home-one');
      const heroRect = heroHome?.getBoundingClientRect();
      if (isHome && main) {
        const homeGapPx = mainRect && headerBottom != null ? Math.round(mainRect.top - headerBottom) : null;
        sendLog({
          hypothesisId: 'HOME_STRIP',
          location: 'LayoutStripDebug.tsx:home only',
          message: 'Home strip and title position',
          data: {
            runId: 'home-strip',
            pathname,
            firstHeaderTop: headerRect?.top,
            mainRectTop: mainRect?.top,
            mainComputedMarginTop: mainStyle?.marginTop,
            heroRectTop: heroRect?.top,
            gapHeaderToMain: homeGapPx,
          },
        });
      }
      // #endregion
    }, 350);
    return () => clearTimeout(t);
  }, []);

  return null;
}
