import {useState} from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

export default function PostForm() {
    const router = useRouter()
    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
        thumbnail: null,
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('category', form.category);
            if (form.thumbnail) {
                formData.append('thumbnail', form.thumbnail);
            }
            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status >= 200 && response.status < 300) {
                setSuccessMessage('Post created successfully!');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
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
            <div>
                <label className="block mb-2">Category</label>
                <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block mb-2">Thumbnail</label>
                <button
                    type="button"
                    className="w-full px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                    onClick={() => document.getElementById('thumbnail-upload').click()}
                >
                    {form.thumbnail ? form.thumbnail.name : 'Upload Thumbnail'}
                </button>
                <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/jfif"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/jfif'];
                            if (!validTypes.includes(file.type)) {
                                setError('Only images (jpeg, jpg, png, gif, webp, jfif) are allowed.');
                                return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                                setError('Image size must be less than 5MB.');
                                return;
                            }
                            setError('');
                            setForm({ ...form, thumbnail: file });
                        }
                    }}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Only images (jpeg, jpg, png, gif, webp, jfif) and less than 5MB are allowed
                </p>
            </div>
            <button
                type="submit"
                disabled={isLoading}

                className="w-full bg-blue-500 text-white py-2 rounded"
            >
                {isLoading ? 'Saving...' : 'Save Post'}
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        </form>
    )    
}