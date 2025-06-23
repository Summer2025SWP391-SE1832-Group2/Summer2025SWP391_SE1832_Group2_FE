import { getAllBlogByBlogTypeID } from '@/services/blogService';
import type { Blog } from '@/types/blog';
import { paths } from '@/utils/constant/path';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// const posts: Post[] = [
//   {
//     id: 2,
//     category: "Sport",
//     date: "Jul 5th '22",
//     title: "Let’s Get Back to Work, New York",
//     image: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/494524518_122125510058831091_2398413459099684334_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=108&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeFxDGQvgaeVXCNnQnqOkmD1h7l1P6_2jUyHuXU_r_aNTCMVGKSCkQ4TpXWBjPW3TXk_jGhKuX8xyhUae_tMGABQ&_nc_ohc=ffjH-pM_WUAQ7kNvwFKoGnC&_nc_oc=AdnH-T9SYVV-ggqU13TPEo7upD4pvTpahN2nxFaMx4TC_PXdnnLJi7tRrBeiZBWElhyv8tOrkYqjpF-p15TAUMmT&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=mrHh40-MuDBCqdRF23cVug&oh=00_AfIFvXnq63wWL2A9ulPlkNULTYXS3vWPbAZKsqp3ALxGag&oe=684388A0",
//   },
//   {
//     id: 3,
//     category: "Business",
//     date: "Jul 5th '22",
//     title: "6 Easy Steps To Create Your Own Cute Merch For Instagram",
//     image: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/494524518_122125510058831091_2398413459099684334_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=108&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeFxDGQvgaeVXCNnQnqOkmD1h7l1P6_2jUyHuXU_r_aNTCMVGKSCkQ4TpXWBjPW3TXk_jGhKuX8xyhUae_tMGABQ&_nc_ohc=ffjH-pM_WUAQ7kNvwFKoGnC&_nc_oc=AdnH-T9SYVV-ggqU13TPEo7upD4pvTpahN2nxFaMx4TC_PXdnnLJi7tRrBeiZBWElhyv8tOrkYqjpF-p15TAUMmT&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=mrHh40-MuDBCqdRF23cVug&oh=00_AfIFvXnq63wWL2A9ulPlkNULTYXS3vWPbAZKsqp3ALxGag&oe=684388A0",
//   },
//   {
//     id: 4,
//     category: "Food",
//     date: "Jul 17th '22",
//     title: "How to Avoid Distraction and Stay Focused During Video Calls?",
//     image: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/494524518_122125510058831091_2398413459099684334_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=108&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeFxDGQvgaeVXCNnQnqOkmD1h7l1P6_2jUyHuXU_r_aNTCMVGKSCkQ4TpXWBjPW3TXk_jGhKuX8xyhUae_tMGABQ&_nc_ohc=ffjH-pM_WUAQ7kNvwFKoGnC&_nc_oc=AdnH-T9SYVV-ggqU13TPEo7upD4pvTpahN2nxFaMx4TC_PXdnnLJi7tRrBeiZBWElhyv8tOrkYqjpF-p15TAUMmT&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=mrHh40-MuDBCqdRF23cVug&oh=00_AfIFvXnq63wWL2A9ulPlkNULTYXS3vWPbAZKsqp3ALxGag&oe=684388A0",
//   },
//   {
//     id: 5,
//     category: "Tech",
//     date: "Mar 1st '22",
//     title: "10 Life-Changing Hacks Every Working Mom Should Know",
//     image: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/494524518_122125510058831091_2398413459099684334_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=108&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeFxDGQvgaeVXCNnQnqOkmD1h7l1P6_2jUyHuXU_r_aNTCMVGKSCkQ4TpXWBjPW3TXk_jGhKuX8xyhUae_tMGABQ&_nc_ohc=ffjH-pM_WUAQ7kNvwFKoGnC&_nc_oc=AdnH-T9SYVV-ggqU13TPEo7upD4pvTpahN2nxFaMx4TC_PXdnnLJi7tRrBeiZBWElhyv8tOrkYqjpF-p15TAUMmT&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=mrHh40-MuDBCqdRF23cVug&oh=00_AfIFvXnq63wWL2A9ulPlkNULTYXS3vWPbAZKsqp3ALxGag&oe=684388A0",
//   },
 
// ];

const BlogPage: React.FC = () => {
  const { blogTypeId } = useParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      console.log('check : ', blogTypeId);
      if (!blogTypeId) return;
      const id = parseInt(blogTypeId); // ép kiểu chuỗi sang số
      if (isNaN(id)) {
        console.error('blogtypeID không hợp lệ');
        return;
      }
      try {
        const data = await getAllBlogByBlogTypeID(id);
        console.log('Blogs fetched:', data);
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
              <img
                src='https://i.pravatar.cc/40?img=3'
                alt='author'
                className='rounded-full w-8 h-8 mr-2'
              />
              <span className='text-sm text-gray-700'>{featuredPost.createBy ?? 'Ẩn danh'}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Right Section */}

      <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {blogs.map((post) => (
          <Link to={paths.blogdetail(String(post.blogId))}>
            <div key={post.blogId} className='flex flex-col'>
              <img
                src={post.image}
                alt={post.title}
                className='rounded-md w-full h-40 object-cover'
              />
              <p className='text-xs text-gray-500 mt-2 uppercase'>
                {post.blogTypeId} • {post.createAt}
              </p>
              <h3 className='font-semibold text-md leading-tight mt-1'>{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
