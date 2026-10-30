import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import "./fonts.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const themeScript = `(function(){try{var t=localStorage.getItem('nm-theme');var l=localStorage.getItem('nm-language');var dark=t?t==='dark':true;if(dark){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=dark?'dark':'light';if(l==='zh'){document.documentElement.lang='zh-Hant';}}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}})();`;

export const metadata: Metadata = {
  title: "Night Market POS · 夜市智慧點餐",
  description:
    "Scan, order and pay from your phone at Dongmen Night Market. A mobile-first smart POS experience.",
  applicationName: "Night Market POS",
  appleWebApp: {
    capable: true,
    title: "Night Market POS",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4eee3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a0e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
