import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JMLR Editor',
  description: 'JMLR Paper Editor: Create academic papers with real-time preview. Perfect for researchers familiar with LaTeX. Write, format and preview your research papers instantly.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
