import { getAllBlogtype } from '@/services/blogService';
import type { BlogType } from '@/types/blog';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        const data = await getAllBlogtype();
        setBlogTypes(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu BlogType:', error);
      }
    };

    fetchBlogTypes();
  }, []);
  const handleClick = (id: number) => {
    //navigate(`/category/${encodeURIComponent(id)}`);
    navigate(`/blog-type/blog/${encodeURIComponent(id)}`);
  };
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {blogTypes.map((item) => (
          <div
            key={item.blogTypeId}
            className='border rounded shadow-sm hover:shadow-md transition'
            onClick={() => handleClick(item.blogTypeId)}
          >
            <img src={item.img} alt={item.title} className='w-full h-48 object-cover rounded-t' />
            <div className='p-4'>
              <h3 className='font-semibold text-blue-700 text-sm leading-tight mb-2'>
                {item.title}
              </h3>
              <p className='text-sm text-gray-600'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogTypePage;
