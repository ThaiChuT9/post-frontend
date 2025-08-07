import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { jwtDecode } from 'jwt-decode';
import { getAuthHeaders } from '../../../utils/auth';

export default function EditPostPage() {
    const router = useRouter();
    const { id } = router.query;

    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Get user ID from token
    useEffect(() => {
        const token = getToken();
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.id);
        }
    }, []);

    // Fetch post data
    useEffect(() => {
        if (id && currentUserId) {
            api.get(`/posts/${id}`)
                .then(res => {
                    const { title, content, category, author } = res.data;

                    if (author._id !== currentUserId) {
                        alert("You are not authorized to edit this post.");
                        router.push('/');
                    } else {
                        setForm({ title, content, category });
                    }
                })
                .catch(err => {
                    console.error('Error loading post:', err);
                    setError('Post not found or error occurred.');
                });
        }
    }, [id, currentUserId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('category', form.category);
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            const token = localStorage.getItem('token');
            await api.put(`/posts/${id}`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    Authorization: `Bearer ${token}`,
                },
            });
            setTimeout(() => {
                router.push(`/posts/${id}`);
            }, 1500);

        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update post');
        } finally {
            setIsLoading(false);
        }
    };

    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1">Content</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded h-32"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Thumbnail</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    {isLoading ? 'Saving...' : 'Update Post'}
                </button>
                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </div>
    );
}
