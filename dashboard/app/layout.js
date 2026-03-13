import { Inter } from 'next/font/google'
import { NextUIProvider } from '@nextui-org/react'
import './globals.css'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Swaasthya-Saathi Dashboard',
  description: 'Mobile-first medical dashboard for rural healthcare',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  )
}
