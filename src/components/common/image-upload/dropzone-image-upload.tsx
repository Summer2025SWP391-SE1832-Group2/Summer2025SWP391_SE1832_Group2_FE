import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImageToCloudinary } from '@/services/cloudinary_service';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  defaultImage?: string;
  className?: string;
  maxSize?: number; // in bytes
}

export const DropzoneImageUpload = ({
  onImageUploaded,
  defaultImage,
  className = '',
  maxSize = 5242880, // 5MB default
}: DropzoneImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(defaultImage);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setError(null);

      try {
        setIsUploading(true);
        const imageUrl = await uploadImageToCloudinary(file);
        onImageUploaded(imageUrl);
      } catch (err) {
        console.error('Error uploading image:', err);
        setError('Tải ảnh thất bại. Vui lòng thử lại.');
        setPreviewUrl(defaultImage ?? undefined);
      } finally {
        setIsUploading(false);
      }
    },
    [defaultImage, onImageUploaded]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize,
    multiple: false,
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="text-sm text-red-500 mt-2">
      {errors.map((e) => (
        <p key={e.code}>{e.message}</p>
      ))}
    </div>
  ));

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onImageUploaded('');
    setError(null);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-md p-4 flex items-center justify-center cursor-pointer transition-colors min-h-[200px] h-[200px] text-center overflow-hidden',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">
              Kéo & thả ảnh vào đây hoặc nhấn để chọn
            </p>
            <p className="text-xs text-gray-400 mt-2">
              (Tối đa {Math.round(maxSize / 1048576)}MB)
            </p>
          </div>
        )}
      </div>

      {fileRejectionItems}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Đang tải ảnh...</span>
        </div>
      )}
    </div>
  );
};
