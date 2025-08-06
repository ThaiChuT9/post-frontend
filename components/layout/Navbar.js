import Link from 'next/link';
import { useRouter } from 'next/router';
import { isAuthenticated, removeToken } from '../../utils/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const router = useRouter();
    const isLoggedIn = isAuthenticated();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = () => {
        removeToken();
        router.push('/login');
    };

    return isClient ? (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Post App</Link>
                <div className="space-x-4">
                    <Link href="/" className="hover:underline">Home</Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/posts" className="hover:underline">Posts</Link>
                            <button onClick={handleLogout} className="hover:underline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-blue-500">
                                Login
                            </Link>
                            <Link href="/register" className="hover:text-blue-500">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    ) : null;
}