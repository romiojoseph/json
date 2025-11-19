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
  authors: [{ name: 'JSON Viewer' }],
  creator: 'JSON Viewer',
  publisher: 'JSON Viewer',
  metadataBase: new URL('https://your-domain.com'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Open JSON - Explore your JSON Data Online',
    description: 'Free online JSON viewer with tree and graph visualization, search, JSONPath queries, structure analysis and CSV export. Paste or upload JSON files instantly.',
    url: 'https://your-domain.com', // Update with your actual domain
    siteName: 'Open JSON',
    images: [
      {
        url: '/social-image.png',
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
    images: ['/social-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#ffffff',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}