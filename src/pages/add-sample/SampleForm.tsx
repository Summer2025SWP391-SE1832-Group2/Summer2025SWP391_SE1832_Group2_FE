import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { NewSample } from "@/types/sample";

type SampleFormProps = {
  bookingId: number;
  onSubmit: (bookingId: number, data: Omit<NewSample, "bookingId">) => void;
  defaultCollectedBy: string;
  loadSchedule: () => Promise<{ collectionDate?: string }>;
};

const SampleForm: React.FC<SampleFormProps> = ({
  bookingId,
  onSubmit,
  defaultCollectedBy,
  loadSchedule,
}) => {
  const [formData, setFormData] = useState<Omit<NewSample, "bookingId">>({
    collectedBy: defaultCollectedBy,
    collectedDate: "",
    sampleType: "",
    participantName: "",
    notes: "",
    picture: "",
    transport: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, collectedBy: defaultCollectedBy }));
  }, [defaultCollectedBy]);

  useEffect(() => {
    loadSchedule().then((schedule) =>
      setFormData((prev) => ({
        ...prev,
        collectedDate: schedule.collectionDate || "",
      }))
    );
  }, [loadSchedule]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(bookingId, formData);
  };

  const isDisabled =
    !formData.sampleType || !formData.participantName || !formData.notes;

  return (
    <div className="space-y-3">
      <div>
        <Label>Loại mẫu</Label>
        <select
          name="sampleType"
          className="border rounded w-full p-2"
          value={formData.sampleType}
          onChange={handleChange}
        >
          <option value="">Chọn loại mẫu</option>
          <option value="Tóc">Tóc</option>
          <option value="Máu">Máu</option>
          <option value="Nước tiểu">Nước tiểu</option>
        </select>
      </div>

      <div>
        <Label>Người tham gia</Label>
        <Input
          name="participantName"
          value={formData.participantName}
          onChange={handleChange}
          placeholder="Nhập tên người tham gia"
        />
      </div>

      <div>
        <Label>Ghi chú</Label>
        <select
          name="notes"
          className="border rounded w-full p-2"
          value={formData.notes}
          onChange={handleChange}
        >
          <option value="">Chọn ghi chú</option>
          <option value="Cha">Cha</option>
          <option value="Mẹ">Mẹ</option>
          <option value="Con">Con</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <Button onClick={handleSubmit} className="w-full" disabled={isDisabled}>
        Lưu
      </Button>
    </div>
  );
};

export default SampleForm;
