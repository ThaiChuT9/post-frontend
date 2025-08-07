import Link from 'next/link';

export default function PostCard({ post }) {
    const thumbnailPath = post.thumbnail?.startsWith('/uploads/')
        ? post.thumbnail
        : `/uploads/${post.thumbnail}`
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <img
                src={`https://post-management-api-ilps.onrender.com${post.thumbnail}`}
                alt={post.title}
                className="w-full object-contain rounded mb-4"
                style={{ maxHeight: '600px' }}
            />
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 "> Author: <span className='font-semibold'>{post.author || 'Unknown'}</span> </span>
                <div className="flex items-center gap-4 ">
                    <Link href={`/posts/${post.id}`} className="text-blue-500 hover:underline text-sm">
                        More Detail
                    </Link>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}