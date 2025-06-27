import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { Toaster } from '@/components/ui/sonner';

import '@/app/globals.css';
import AppProviders from '@/components/providers/AppProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 metadataBase: new URL('http://localhost:3000'),
  title: 'Lex | Reporting Experts',
  description:
    'A powerful SaaS platform that combines workflow management with automated web scraping to streamline data collection and processing.',
  keywords: ['Reporting', 'workflow', 'data'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={'/sign-in'}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm !shadow-none',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <AppProviders>{children}</AppProviders>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
