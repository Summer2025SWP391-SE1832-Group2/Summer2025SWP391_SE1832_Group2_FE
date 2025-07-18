import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { addFavorite, getBlogById } from '@/services/blogService';
import type { Blog } from '@/types/blog';
import Comment from '@/pages/comment';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';

export default function BlogDetailHomePage() {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const navigate = useNavigate();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const {  user } = useAuthStore();
  const handleToggleFavorite = async () => {
    try {
      if (!blog || !user?.userId) return;
      if (liked) {
        setFavoriteCount((prev) => Math.max(prev - 1, 0));
      } else {
        await addFavorite(blog.blogId,user?.userId );
        setFavoriteCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Lỗi khi cập nhật lượt thích:', error);
    }
  };
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(Number(blogId));
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog detail:', error);
      }
    };

    if (blogId) fetchBlog();
    // getFavoriteStats(Number(blogId)).then((res) => {
    //   setFavoriteCount(res.count);
    //   setLiked(res.liked);
    // });
    setFavoriteCount(15);
    setLiked(false);
  }, [blogId]);
 

  if (!blog) {
    return <p className='p-6 text-muted-foreground'>Đang tải chi tiết blog...</p>;
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      <Button variant='ghost' onClick={() => navigate(-1)}>
        <ArrowLeft className='w-4 h-4 mr-2' />
        Quay lại
      </Button>

      <Card>
        <CardContent className='p-6 space-y-4'>
          <img src={blog.image} alt={blog.title} className='w-full h-64 object-cover rounded-md' />
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>{blog.title}</h1>
            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='icon' onClick={handleToggleFavorite}>
                {liked ? (
                  <Heart className='text-red-500 fill-red-500 w-5 h-5' />
                ) : (
                  <Heart className='w-5 h-5' />
                )}
              </Button>
              <span className='text-sm text-muted-foreground'>{favoriteCount}</span>
            </div>
          </div>
          <p className='text-sm text-muted-foreground'>
            Cập nhật: {new Date(blog.updateAt).toLocaleString()}
          </p>
          <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: blog.content }} />
        </CardContent>
      </Card>
      <div className='mt-6'>
        <h2 className='text-2xl font-semibold p-2'>Bình luận</h2>
        <Comment blogId={Number(blogId)} />
      </div>
    </div>
  );
}
