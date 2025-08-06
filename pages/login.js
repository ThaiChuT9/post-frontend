import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import api from '../services/api';
import { setToken } from '../utils/auth';
import Link from 'next/link';

export default function Login() {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/login', {
                username: form.username,
                password: form.password,
            });
            if (response.status >= 200 && response.status < 300) {
                setSuccessMessage('Login successful! Redirecting...');
                setToken(response.data.token);
                setTimeout(() => {
                    router.push('/'); // Redirect to home page after successful login
                }, 2000);
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        style={{ backgroundColor: isLoading ? '#ccc' : '#007bff' }}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
                    <p className="text-center text-sm text-gray-600">
                        Don&#39;t have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
