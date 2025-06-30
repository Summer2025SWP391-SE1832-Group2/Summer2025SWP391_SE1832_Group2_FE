import React, { useState } from "react";
import type { Sample, NewSample } from "@/types/sample";
import { Button } from "@/components/ui/button";
import SampleForm from "./SampleForm";

type SampleListProps = {
  samples: Sample[];
  onDelete: (sampleId: number) => void;
  onEdit: (sample: Sample) => void;
};

const SampleList: React.FC<SampleListProps> = ({ samples, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (samples.length === 0) {
    return <div className="text-sm text-red-600 p-2">Chưa có mẫu.</div>;
  }

  return (
    <div className="space-y-2">
      {samples.map((s) => (
        <div
          key={s.sampleId}
          className="border p-2 rounded text-sm bg-white shadow-sm space-y-2"
        >
          {editingId === s.sampleId ? (
            <SampleForm
              bookingId={s.bookingId}
              defaultCollectedBy={s.collectedBy}
              loadSchedule={() => Promise.resolve({ collectionDate: s.collectedDate })}
              onSubmit={(bookingId, data) => {
                onEdit({ ...s, ...data });
                setEditingId(null);
              }}
            />
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <p>
                  <strong>ID:</strong> {s.sampleId}
                </p>
                <p>
                  <strong>Người tham gia:</strong> {s.participantName}
                </p>
                <p>
                  <strong>Loại:</strong> {s.sampleType}
                </p>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => setEditingId(s.sampleId)}>
                  Sửa
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(s.sampleId)}>
                  Xoá
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SampleList;
