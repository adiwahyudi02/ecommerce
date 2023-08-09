import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ecommerce.',
    description: 'This e-commerce is only for testing',
}

interface IRootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: IRootLayoutProps) {
    return (
        <html lang="en">
            <body className={`${inter.className} block lg:flex gap-6 p-3 sm:p-5 bg-gray-100`}>
                <Sidebar />
                <main className="flex-1 w-full">
                    {children}
                </main>
            </body>
        </html>
    )
}
