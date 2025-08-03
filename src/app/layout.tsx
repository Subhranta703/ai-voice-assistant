import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'AI Voice Assistant',
  description: 'Offline-capable speech app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
