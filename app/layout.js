import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

export const metadata = {
  title: 'Open JSON - Explore your JSON Data Online',
  description: 'Free online JSON viewer with tree and graph visualization, search, JSONPath queries, structure analysis and CSV export. Paste or upload JSON files instantly.',
  keywords: 'json viewer, json visualizer, json tree, json graph, json formatter, json parser, json validator, jsonpath, json to csv, json analyzer',
  metadataBase: new URL('https://romiojoseph.github.io/json/'),
  alternates: {
    canonical: 'https://romiojoseph.github.io/json/',
  },
  openGraph: {
    title: 'Open JSON - Explore your JSON Data Online',
    description: 'Free online JSON viewer with tree and graph visualization, search, JSONPath queries, structure analysis and CSV export. Paste or upload JSON files instantly.',
    url: 'https://romiojoseph.github.io/json/',
    siteName: 'Open JSON',
    images: [
      {
        url: '/json/social-image.png',
        width: 1200,
        height: 630,
        alt: 'Open JSON - Explore your JSON Data Online',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open JSON - Explore your JSON Data Online',
    description: 'Free online JSON viewer with tree and graph visualization, search, JSONPath queries, structure analysis and CSV export. Paste or upload JSON files instantly.',
    images: ['/json/social-image.png'],
  },
  icons: {
    icon: '/json/favicon.svg',
    shortcut: '/json/favicon.svg',
    apple: '/json/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}