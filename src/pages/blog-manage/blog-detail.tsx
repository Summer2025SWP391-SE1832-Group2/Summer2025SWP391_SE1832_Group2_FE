import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getBlogById } from '@/services/blogService'; 
import type { Blog } from '@/types/blog';

export default function BlogDetailManagePage() {
  const { blogId } = useParams<{ blogId: string }>(); 
  const [blog, setBlog] = useState<Blog | null>(null);
  const navigate = useNavigate();

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
  }, [blogId]);

  if (!blog) {
    return <p className="p-6 text-muted-foreground">Đang tải chi tiết blog...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardContent className="p-6 space-y-4">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-md"
          />
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <p className="text-sm text-muted-foreground">
            Cập nhật: {new Date(blog.updateAt).toLocaleString()}
          </p>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
