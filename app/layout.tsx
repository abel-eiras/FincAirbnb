import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'FincAirbnb - Aluga a túa finca para plantar | Galicia',
  description: 'Como un FarmVille real pero en Galicia. Aluga fincas por meses para plantar o que che dea a gana. Comida real, bronceado de nuca garantido.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="gl">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}