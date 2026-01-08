import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Book List',
  description: 'A personal collection of books I have read',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
