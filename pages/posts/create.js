import PostForm from '../../components/posts/PostForm';

export default function CreatePost() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Create Post</h1>
            <PostForm />
        </div>
    );
}