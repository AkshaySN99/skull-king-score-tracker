import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Skull King Score Tracker',
  description: 'Track scores for the Skull King card game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#D2B48C] text-[#000000]`}>{children}</body>
    </html>
  )
}

