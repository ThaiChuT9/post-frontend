import {useState} from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

export default function PostForm() {
    const router = useRouter()
    const [form, setForm] = useState({
        title: '',
        content: '',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/posts', {
                title: form.title,
                content: form.content,
            });
            if (response.status >= 200 && response.status < 300) {
                router.push('/'); // Redirect to home page after successful post creation
            } else {
                setError('Failed to create post. Please try again.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create post';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-2">Title</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block mb-2">Content</label>
                <textarea
                    value={form.content}
                    onChange={(e) => setForm({...form, content: e.target.value})}
                    className="w-full px-4 py-2 border rounded h-32"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded"
            >
                {isLoading ? 'Saving...' : 'Save Post'}
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
    )    
}