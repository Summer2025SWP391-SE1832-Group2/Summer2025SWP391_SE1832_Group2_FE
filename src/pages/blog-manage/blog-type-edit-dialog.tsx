import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BlogType } from "@/types/blog";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { updateBlogType } from "@/services/blogService"; // ✅ Import API

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (updated: BlogType) => void; // ✅ Trả về object đã update từ server
  initialData: BlogType | null;
}

export default function BlogTypeEditorDialog({ open, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<BlogType>>({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleSubmit = async () => {
    if (!formData.blogTypeId || !formData.title || !formData.description || !formData.img) return;

    try {
      const updated = await updateBlogType(formData); // ✅ Gọi API
      onSave(updated); // ✅ Trả kết quả ra ngoài để cập nhật UI
      onClose();       // ✅ Đóng dialog
    } catch (err) {
      console.error("Update failed:", err);
      // TODO: hiển thị lỗi nếu cần
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Cập nhật" : "Tạo mới"} Blog Type</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={formData.img || ""}
            onChange={(e) => setFormData({ ...formData, img: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
