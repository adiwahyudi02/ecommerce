import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { ConfigProvider } from 'antd'
import { RootStyleRegistry } from '@/components/RootStyleRegistry'

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
            <RootStyleRegistry>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: 'rgb(67 56 202 / 1)', // indigo-700
                        },
                    }}
                >
                    <body className={`${inter.className} p-3 sm:p-5 bg-gray-100`}>
                        <Sidebar />
                        <main className="flex-1 w-full lg:flex lg:justify-end">
                            <div className="lg:w-[calc(100%-316px)]">
                                {children}
                            </div>
                        </main>
                    </body>
                </ConfigProvider>
            </RootStyleRegistry>
        </html>
    )
}
