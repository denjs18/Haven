import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const geist = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Haven — Gérez vos projets PocketBase',
  description:
    'Haven vous permet de gérer plusieurs projets avec base de données, auth et stockage sur votre propre VPS.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
