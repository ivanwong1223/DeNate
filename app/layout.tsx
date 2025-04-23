import type React from 'react';
import '@/app/globals.css';
// import { Inter } from "next/font/google"
import { Roboto } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { SiteFooter } from '@/components/site-footer';
import { ThemeProvider } from '@/components/theme-provider';
import Web3Provider from '@/components/Web3Provider';
import ClientLayout from '@/components/ClientLayout';
import 'primeicons/primeicons.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'DeNate - Transparent Blockchain Charity Platform',
  description:
    'A blockchain-powered charity platform for transparent, secure donation tracking using blockchain technology and smart contracts.',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/denate-single-logo.png"></link>
      </head>
      <body className={roboto.className}>
        <ToastContainer />
        <Web3Provider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="denate-theme">
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

import './globals.css';
