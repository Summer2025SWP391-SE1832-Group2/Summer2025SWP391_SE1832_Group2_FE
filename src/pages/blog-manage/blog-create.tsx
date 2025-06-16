import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createBlog, getAllBlogtype } from "@/services/blogService";
import type { BlogType } from "@/types/blog";

export default function BlogCreatePage() {
  const [title, setTitle] = useState("");
  const [blogTypeId, setBlogTypeId] = useState<string>("");
  const [contentHTML, setContentHTML] = useState("");
  const [showHTMLPreview, setShowHTMLPreview] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        const data = await getAllBlogtype();
        setBlogTypes(data);
        if (data.length > 0) setBlogTypeId(data[0].blogTypeId.toString());
      } catch (err) {
        toast.error("Không thể tải danh sách loại blog");
      }
    };
    fetchBlogTypes();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Strike,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem,
      Blockquote,
      CodeBlock,
      Link,
      Image,
    ],
    content: "<p>Nhập nội dung blog ở đây...</p>",
    onUpdate({ editor }) {
      setContentHTML(editor.getHTML());
    },
  });

  const insertImage = () => {
    if (editor && imageURL) {
      editor.chain().focus().setImage({ src: imageURL }).run();
      setImageURL("");
    }
  };

  const handleSubmit = async () => {
    const blogData = {
      createBy: 1,
      title,
      content: contentHTML,
      blogTypeId: Number(blogTypeId),
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      image: thumbnail,
    };
    try {
      await createBlog(blogData);
      toast.success("Tạo blog thành công!");
    } catch (err) {
      toast.error("Tạo blog thất bại");
    }
  };

  const headingLevels: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  return (
<div className="min-h-screen overflow-y-auto px-4 py-6 bg-background">
      <h1 className="text-4xl font-bold mb-6 text-center">Tạo Blog Mới</h1>

      <div className="container mx-auto">
  <Card className="w-full">
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Tiêu đề</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề blog" />
              </div>

              <div className="space-y-2">
                <Label>Loại blog</Label>
                <Select value={blogTypeId} onValueChange={setBlogTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại blog" />
                  </SelectTrigger>
                  <SelectContent>
                    {blogTypes.map((type) => (
                      <SelectItem key={type.blogTypeId} value={type.blogTypeId.toString()}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ảnh đại diện</Label>
              <Input
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="URL ảnh đại diện"
              />
            </div>

            {editor && (
              <div className="flex flex-wrap gap-2 border p-3 rounded-md bg-muted">
                <Button onClick={() => editor.chain().focus().toggleBold().run()}>B</Button>
                <Button onClick={() => editor.chain().focus().toggleItalic().run()}>I</Button>
                <Button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</Button>
                <Button onClick={() => editor.chain().focus().toggleStrike().run()}>S</Button>
                <Button onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Button>
                <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"<>"}</Button>
                <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Button>
                <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Button>
                <Button onClick={() => editor.chain().focus().toggleTaskList().run()}>☑</Button>
                {headingLevels.map((level) => (
                  <Button
                    key={level}
                    onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                  >
                    H{level}
                  </Button>
                ))}
                <input
                  type="color"
                  title="Chọn màu chữ"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                />
                <Button onClick={() => editor.chain().focus().undo().run()}>↺ Undo</Button>
                <Button onClick={() => editor.chain().focus().redo().run()}>↻ Redo</Button>
                <Button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>🧹 Clear</Button>
              </div>
            )}

            <div className="space-y-2">
              <Label>Chèn ảnh từ URL</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                />
                <Button onClick={insertImage}>Thêm ảnh</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nội dung</Label>
              <div className="border rounded-md p-3 min-h-[300px] dark:prose-invert prose">
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showHTMLPreview} onCheckedChange={setShowHTMLPreview} />
              <Label>Xem trước HTML</Label>
            </div>

            {showHTMLPreview && (
              <Textarea readOnly value={contentHTML} className="h-64 text-sm font-mono bg-muted" />
            )}

            <Button onClick={handleSubmit} className="w-full">Tạo blog</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
