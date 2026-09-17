"use client";

import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { useEffect, useState } from "react";
import { shouldCollectAnalytics } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function SiteAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(shouldCollectAnalytics());
  }, []);

  if (!enabled) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
      <Analytics />
    </>
  );
}
