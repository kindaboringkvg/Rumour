import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from 'next/font/google'

import '../globals.css';


export const metadata = {
    title: 'Rumour',
    description: 'A Next.js 13 Meta Application'
}

const inter = Inter({ subsets: ['latin'] })

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;


export default function RootLayout({ 
    children
}: { 
    children: React.ReactNode

}){
    return (
        <ClerkProvider >
            <html lang ="en">
            <body className={`${inter.className} bg-dark-1`}>
                {children}
            </body>
            </html>
        </ClerkProvider>
    )
}