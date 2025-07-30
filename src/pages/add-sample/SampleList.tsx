import React, { useState } from 'react';
import type { Sample } from '@/types/sample';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { updateSamplePictureService } from '@/services/sample_service';
import { DropzoneImageUpload } from '@/components/common/image-upload';

type SampleListProps = {
  samples: Sample[];
  onReload: () => void;
};

const SampleList: React.FC<SampleListProps> = ({ samples, onReload }) => {
  const [imageUrlMap, setImageUrlMap] = useState<Record<number, string>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleImageUploaded = (sampleId: number, url: string) => {
    setImageUrlMap((prev) => ({ ...prev, [sampleId]: url }));
    console.log(`Image uploaded for sample ${sampleId}:`, url);
  };

  const handleUpdatePicture = async (sampleId: number) => {
    try {
      const url = imageUrlMap[sampleId];
      if (!url) return;
      setLoadingId(sampleId);
      await updateSamplePictureService(sampleId, url);
      showToast('Cập nhật hình ảnh thành công.', 'success');
      onReload();
    } catch (err) {
      console.error(err);
      showToast('Cập nhật hình ảnh thất bại.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  if (samples.length === 0) {
    return <div className='text-sm text-red-600 p-2'>Chưa có mẫu.</div>;
  }

  return (
    <div className='space-y-4'>
      {samples.map((s) => (
        <div key={s.sampleId} className='border p-3 rounded bg-white shadow-sm space-y-2 text-sm'>
          <div>
            <p>
              <strong>ID:</strong> {s.sampleId}
            </p>
            <p>
              <strong>Người tham gia:</strong> {s.participantName}
            </p>
            <p>
              <strong>Loại mẫu:</strong> {s.sampleType}
            </p>
            <p>
              <strong>Hình ảnh hiện tại:</strong> <br />
              {s.picture ? (
                <img
                  src={s.picture}
                  alt='Ảnh mẫu'
                  className='mt-1 h-24 object-cover border rounded'
                />
              ) : (
                <span className='italic text-muted'>Chưa có</span>
              )}
            </p>
          </div>

          <div className='flex gap-2 items-center'>
            <DropzoneImageUpload
              onImageUploaded={(url) => handleImageUploaded(s.sampleId, url)}
              defaultImage={imageUrlMap[s.sampleId]}
            />
            {imageUrlMap[s.sampleId] && (
              <Button
                size='sm'
                disabled={loadingId === s.sampleId}
                onClick={() => handleUpdatePicture(s.sampleId)}
              >
                {loadingId === s.sampleId ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SampleList;
