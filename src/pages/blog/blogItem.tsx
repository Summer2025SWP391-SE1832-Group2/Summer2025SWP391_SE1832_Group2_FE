// src/components/blog/BlogItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Blog } from '@/types/blog';
import { paths } from '@/utils/constant/path';

interface BlogItemProps {
  blog: Blog;
}

const BlogItem: React.FC<BlogItemProps> = ({ blog }) => {
  return (
    <Link to={paths.blogdetail(String(blog.blogId))}>
      <div className='flex flex-col'>
        <img
          src={blog.image}
          alt={blog.title}
          className='rounded-md w-full h-40 object-cover'
        />
        <p className='text-xs text-gray-500 mt-2 uppercase'>
          {blog.blogTypeId} • {new Date(blog.createAt).toLocaleDateString()}
        </p>
        <h3 className='font-semibold text-md leading-tight mt-1'>{blog.title}</h3>
      </div>
    </Link>
  );
};

export default BlogItem;
