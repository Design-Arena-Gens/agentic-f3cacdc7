import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adalberto Alves - Personal Dog Training',
  description: 'Compartilhe fotos e vídeos do treinamento dos seus cães',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
