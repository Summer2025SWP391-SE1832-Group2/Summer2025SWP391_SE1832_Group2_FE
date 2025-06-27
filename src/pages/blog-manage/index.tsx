import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Blog, Blogtype } from '@/types/blog';
import { getAllBlogByBlogTypeID, getAllBlogtype } from '@/services/blogService';
import { MoreHorizontal, Pencil, BarChart2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import {
//   Table,
//   TableCaption,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
// import BlogTypeEditorDialog from './blog-type-edit-dialog';
import { paths } from '@/utils/constant/path';
import BlogTypeEditorDialog from './blog-type-edit-dialog';
export default function BlogManagementPage() {
  const [blogTypes, setBlogTypes] = useState<Blogtype[]>([]);
  const [selectedBlogType, setSelectedBlogType] = useState<Blogtype | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editBlogType, setEditBlogType] = useState<Blogtype | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBlogtype();
        setBlogTypes(data);
      } catch (error) {
        console.error('Error fetching blog types:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectBlogType = async (id: number) => {
    try {
      const selected = blogTypes.find((bt) => bt.blogTypeId === id) || null;
  setSelectedBlogType(selected);
  setBlogs([]);

      const data = await getAllBlogByBlogTypeID(id);
     
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const openEditDialog = (type: Blogtype) => {
    setEditBlogType(type);
    setEditDialogOpen(true);
  };

  const handleSaveBlogType = (updated: Blogtype) => {
    setBlogTypes((prev) => prev.map((bt) => (bt.blogTypeId === updated.blogTypeId ? updated : bt)));
    setEditDialogOpen(false);
  };

  return (
    <div className='grid grid-cols-4 gap-6 p-6 h-screen overflow-hidden'>
      <div className='col-span-1 space-y-4 overflow-y-auto pr-2'>
        <div className='flex items-center justify-between sticky top-0 bg-white dark:bg-background z-10 pb-2'>
          <h2 className='text-xl font-bold sticky top-0 bg-white dark:bg-background z-10 pb-2'>
            Loại Blog
          </h2>
          <Button variant='outline' size='icon'>
            <Plus className='w-5 h-5' />
          </Button>
        </div>

        {blogTypes.map((type) => (
          <Card
            key={type.blogTypeId}
            className={`relative cursor-pointer transition-all hover:shadow-md ${
              selectedBlogType?.blogTypeId === type.blogTypeId ? 'border-primary border-2' : ''
            }`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='absolute top-2 right-2 w-8 h-8 p-0'
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => openEditDialog(type)}>
                  <Pencil className='mr-2 h-4 w-4' /> Cập nhật
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart2 className='mr-2 h-4 w-4' /> Thống kê
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CardContent
              onClick={() => handleSelectBlogType(type.blogTypeId)}
              className='p-4 space-y-2'
            >
              <img
                src={type.img}
                alt={type.title}
                className='w-full h-32 object-cover rounded-md'
              />
              <div>
                <h3 className='font-semibold text-lg'>{type.title}</h3>
                <p className='text-sm text-muted-foreground truncate'>{type.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='col-span-3 space-y-4 overflow-y-auto pr-2'>
        <div className='flex items-center justify-between sticky top-0 bg-white dark:bg-background z-10 pb-2'>
          <h2 className='text-xl font-bold'>
            {selectedBlogType
              ? `Blogs thuộc ${selectedBlogType.title}`
              : 'Chọn loại blog để xem bài viết'}
          </h2>
          <Button
            variant='outline'
            size='icon'
            onClick={() => (window.location.href = '/dashboard/blogmanage/blogcreate')}
          >
            <Plus className='w-5 h-5' />
          </Button>
        </div>

        {blogs.map((blog) => (
          <Card key={blog.blogId}>
          <Link to={paths.blogdetail(String(blog.blogId))}>

            <CardContent className='p-4 space-y-2'>
              <img
                src={blog.image}
                alt={blog.title}
                className='w-full h-40 object-cover rounded-md'
              />
              <h3 className='font-semibold text-xl'>{blog.title}</h3>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }}
              />
              <p className='text-xs text-muted-foreground'>
                Cập nhật: {new Date(blog.updateAt).toLocaleString()}
              </p>
            </CardContent>
            </Link>
          </Card>
        ))}

        {selectedBlogType && blogs.length === 0 && (
          <p className='text-muted-foreground italic'>Không có blog nào trong loại này.</p>
        )}
      </div>

      <BlogTypeEditorDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveBlogType}
        initialData={editBlogType}
      />
    </div>
  );
}
