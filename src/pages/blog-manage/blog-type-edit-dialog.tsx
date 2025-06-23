import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Blogtype } from "@/types/blog";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { updateBlogType } from "@/services/blogService"; 

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (updated: Blogtype) => void; 
  initialData: Blogtype | null;
}

export default function BlogTypeEditorDialog({ open, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<Blogtype>>({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleSubmit = async () => {
    if (!formData.blogTypeId || !formData.title || !formData.description || !formData.img) return;

    try {
      const updated = await updateBlogType(formData); 
      onSave(updated); 
      onClose();       
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
