import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Không render gì cho đến khi component được mount trên client
    if (!mounted) {
        return null
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    )
}