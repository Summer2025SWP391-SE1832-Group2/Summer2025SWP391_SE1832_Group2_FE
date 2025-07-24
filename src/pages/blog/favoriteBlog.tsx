import { getFavoriteBlogs, getAllBlogtype } from '@/services/blogService';
import { useAuthStore } from '@/stores/auth';
import { useEffect, useState } from 'react';
import type { Blog, Blogtype } from '@/types/blog';
import BlogItem from './blogItem';

const FavoriteBlog = () => {
  const { user } = useAuthStore();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogTypes, setBlogTypes] = useState<Blogtype[]>([]);
  const [selectedBlogTypeId, setSelectedBlogTypeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        const data = await getAllBlogtype();
        setBlogTypes(data);
      } catch (err) {
        console.error('Lỗi khi lấy blog types:', err);
      }
    };

    fetchBlogTypes();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (user?.userId != null) {
          let data = await getFavoriteBlogs(user.userId);
          if (selectedBlogTypeId !== null) {
            data = data.filter((b) => b.blogTypeId === selectedBlogTypeId);
          }
          setBlogs(data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy blogs:', error);
      }
    };

    fetchBlogs();
  }, [user?.userId, selectedBlogTypeId]);

  return (
    <div className='max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8'>
      {/* Cột trái: Danh sách BlogType */}
      <div className='md:col-span-1 border rounded-lg shadow p-4 bg-white'>
        <h2 className='text-xl font-semibold mb-4'>Danh mục</h2>
        <div className='space-y-2'>
          <div
            onClick={() => setSelectedBlogTypeId(null)}
            className={`cursor-pointer pl-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${
              selectedBlogTypeId === null ? 'bg-gray-100 font-semibold' : ''
            }`}
          >
            Tất cả
          </div>
          {blogTypes.map((type) => (
            <div
              key={type.blogTypeId}
              onClick={() => setSelectedBlogTypeId(type.blogTypeId)}
              className={`cursor-pointer pl-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${
                selectedBlogTypeId === type.blogTypeId ? 'bg-gray-100 font-semibold' : ''
              }`}
            >
              {type.title}
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Bài viết yêu thích */}
      <div className='md:col-span-3 w-full'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold mb-2'>Bài viết yêu thích</h1>
          <p className='text-gray-600'>Danh sách các bài viết bạn đã đánh dấu yêu thích.</p>
        </div>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">Không có bài viết nào.</p>
        ) : (
          <div className='space-y-6'>
            {blogs.map((post) => (
              <div
                key={post.blogId}
                className='border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4'
              >
                <BlogItem blog={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteBlog;
