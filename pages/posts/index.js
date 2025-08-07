import { useEffect, useState } from 'react';
import api from '../../services/api';
import PostCard from '../../components/posts/PostCard';

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await api.get('/posts');
                setPosts(res.data);
            } catch (err) {
                setError('Failed to fetch posts.');
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const handleCreatePost = () => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        router.push('/posts/create');
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">All Posts</h1>
                <button
                    onClick={handleCreatePost}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create New Post
                </button>
            </div>
            {posts.length === 0 ? (
                <div>No posts found.</div>
            ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
            )}
        </div>
    );
}
