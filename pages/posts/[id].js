import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../../utils/auth';

export default function PostDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    const handleDelete = async () => {
        const confirmed = confirm('Are you sure you want to delete this post?');
        if (!confirmed) return;

        try {
            const token = getToken();
            await api.delete(`/posts/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Post deleted successfully!');
            router.push('/');
        } catch (err) {
            console.error('Failed to delete post:', err);
            alert('Failed to delete post');
        }
    };


    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUserId(decoded.id);
            } catch (e) {
                console.error('Invalid token', e);
            }
        }
    }, []);

    useEffect(() => {
        if (id) {
            api.get(`/posts/${id}`)
                .then(res => setPost(res.data))
                .catch(err => {
                    console.error('Failed to load post:', err);
                    setError('Post not found');
                });
        }
    }, [id]);


    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
    if (!post) return <p className="text-center mt-10">Loading...</p>;

    const fullDate = new Date(post.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const thumbnailPath = post.thumbnail?.startsWith('/uploads/')
        ? post.thumbnail
        : `/uploads/${post.thumbnail}`

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-6">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-1">
                By <span className="font-semibold">{post.author?.username}</span> | {fullDate}
            </div>
            <div className="text-sm text-gray-500 mb-4">
                Category <span className="font-semibold">{post.category}</span>
            </div>
            {post.thumbnail && (
                <img
                    src={`http://localhost:3000${thumbnailPath}`}
                    alt={post.title}
                    className="w-full object-contain rounded mb-4"
                    style={{ maxHeight: '600px' }}
                />
            )}
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {post.content}
            </p>
            {post.author && post.author?._id?.toString() === currentUserId && (
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => router.push(`/posts/edit/${post._id}`)}
                        className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            )}

        </div>
    );
}
