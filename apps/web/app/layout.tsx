import type React from 'react';
import '../../../packages/design-system/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { cn } from '@/lib/cn';


export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en"   className={cn(GeistSans.variable, "font-geistSans")}>
      <body>{children}</body>
    </html>
  );
}
