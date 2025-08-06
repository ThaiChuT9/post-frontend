import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import PostCard from '../components/posts/PostCard';
import { isAuthenticated } from '../utils/auth';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data);
        } catch (err) {
            setError('Failed to fetch posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = () => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        router.push('/posts/create');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Recent Posts</h1>
                <button
                    onClick={handleCreatePost}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create New Post
                </button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p>No posts found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}