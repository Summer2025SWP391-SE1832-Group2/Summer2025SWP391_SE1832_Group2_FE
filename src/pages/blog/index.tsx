import { getAllBlogByBlogTypeID } from '@/services/blogService';
import type { Blog } from '@/types/blog';
import { paths } from '@/utils/constant/path';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BlogItem from './blogItem';

const BlogPage: React.FC = () => {
  const { blogTypeId } = useParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!blogTypeId) return;
      const id = parseInt(blogTypeId); // ép kiểu chuỗi sang số
      if (isNaN(id)) {
        console.error('blogtypeID không hợp lệ');
        return;
      }
      try {
        const data = await getAllBlogByBlogTypeID(id);
        setBlogs(data);
        if (data.length > 0) {
          setFeaturedPost(data[0]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy blogs theo BlogTypeID:', error);
      }
    };
    fetchBlogs();
  }, [blogTypeId]);

  return (
    <div className='max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10'>
      {/* Featured Post */}
      {featuredPost && (
        <Link to={paths.blogdetail(String(featuredPost.blogId))}>
          <div className='md:col-span-1'>
            <img
              src={featuredPost.image}
              alt='featured'
              className='rounded-lg w-full h-64 object-cover'
            />
            <p className='text-sm text-gray-500 mt-4 uppercase'>
              Loại {featuredPost.blogTypeId} •{' '}
              {new Date(featuredPost.createAt).toLocaleDateString()}
            </p>
            <h2 className='text-2xl font-bold mt-2'>{featuredPost.title}</h2>
            <p className='text-gray-600 mt-2 text-sm'>
              {featuredPost.blogTypeId ?? 'Không có mô tả.'}
            </p>
            <div className='flex items-center mt-4'>
              <span className='text-sm text-gray-700'>{featuredPost.createBy ?? 'Ẩn danh'}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Right Section */}

      <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {blogs
          .filter((post) => post.blogId !== featuredPost?.blogId) // tránh trùng
          .map((post) => (
            <BlogItem key={post.blogId} blog={post} />
          ))}
      </div>
    </div>
  );
};

export default BlogPage;
