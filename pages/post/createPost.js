// Upload imgage 
const formData = new FormData();
formData.append('title', Data.title);
formData.append('content', Data.content);
formData.append('category', Data.category);
formData.append('thumbnail', Data.thumbnail[0]);

await api.post('/posts', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});