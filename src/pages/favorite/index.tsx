import type { Blog } from "@/types/blog";
import { paths } from "@/utils/constant/path";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FavoritePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const mockBlogs: Blog[] = [
    {
      blogId: 1,
      createBy: 101,
      title: "Lập trình React từ cơ bản đến nâng cao",
      content: "<p>React là một thư viện JavaScript phổ biến...</p>",
      blogTypeId: 1,
      createAt: "2024-12-01T08:30:00Z",
      updateAt: "2025-01-01T09:00:00Z",
      image: "https://source.unsplash.com/600x400/?reactjs,code",
    },
    {
      blogId: 2,
      createBy: 102,
      title: "5 xu hướng công nghệ năm 2025",
      content: "<p>Công nghệ AI, Web3, Metaverse, Blockchain đang thay đổi thế giới...</p>",
      blogTypeId: 2,
      createAt: "2025-02-15T14:10:00Z",
      updateAt: "2025-03-01T10:00:00Z",
      image: "https://source.unsplash.com/600x400/?technology,trends",
    },
    {
      blogId: 3,
      createBy: 103,
      title: "Hướng dẫn cấu hình môi trường Node.js",
      content: "<p>Việc cấu hình đúng môi trường là rất quan trọng khi phát triển backend...</p>",
      blogTypeId: 1,
      createAt: "2025-01-20T07:45:00Z",
      updateAt: "2025-01-22T08:00:00Z",
      image: "https://source.unsplash.com/600x400/?nodejs,backend",
    },
    {
      blogId: 4,
      createBy: 104,
      title: "Tư duy thiết kế UI/UX hiệu quả",
      content: "<p>Thiết kế giao diện người dùng tốt giúp giữ chân người dùng...</p>",
      blogTypeId: 3,
      createAt: "2025-04-10T16:00:00Z",
      updateAt: "2025-04-15T18:00:00Z",
      image: "https://source.unsplash.com/600x400/?design,ux,ui",
    },
    {
      blogId: 5,
      createBy: 105,
      title: "DevOps là gì? Tại sao lại quan trọng?",
      content: "<p>DevOps kết nối giữa đội phát triển và vận hành nhằm cải thiện hiệu suất...</p>",
      blogTypeId: 4,
      createAt: "2025-03-05T12:20:00Z",
      updateAt: "2025-03-10T13:00:00Z",
      image: "https://source.unsplash.com/600x400/?devops,server",
    },
  ];

  useEffect(() => {
    setBlogs(mockBlogs);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Bài viết yêu thích</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <Link
            key={post.blogId}
            to={paths.blogdetail(String(post.blogId))}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="p-4 space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Chủ đề #{post.blogTypeId} • {new Date(post.createAt).toLocaleDateString("vi-VN")}
                </p>
                <h3 className="font-semibold text-lg text-gray-800 leading-snug line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
