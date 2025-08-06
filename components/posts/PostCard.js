export default function PostCard({ post }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">By {post.author}</span>
                <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}