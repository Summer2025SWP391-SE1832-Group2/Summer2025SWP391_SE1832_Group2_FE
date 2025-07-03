import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImageToCloudinary } from '@/services/cloudinary_service';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

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

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setError(null);

      try {
        setIsUploading(true);
        const imageUrl = await uploadImageToCloudinary(file);
        onImageUploaded(imageUrl);
      } catch (err) {
        console.error('Error uploading image:', err);
        setError('Failed to upload image. Please try again.');
        // Reset preview on error if there was no default
        if (!defaultImage) {
          setPreviewUrl(undefined);
        } else {
          setPreviewUrl(defaultImage);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [defaultImage, onImageUploaded],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize,
    multiple: false,
  });

  // Handle file rejections (e.g., file too large)
  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className='text-sm text-red-500 mt-2'>
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
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {previewUrl ? (
        <div className='relative'>
          <img
            src={previewUrl}
            alt='Preview'
            className='object-cover rounded-md max-h-64 max-w-full'
          />
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2 h-6 w-6'
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors w-full min-h-[200px] ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className='text-center'>
              <ImageIcon className='h-12 w-12 text-primary mx-auto mb-4' />
              <p className='text-sm'>Drop the image here</p>
            </div>
          ) : (
            <div className='text-center'>
              <Upload className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <p className='text-sm text-gray-500'>Drag & drop an image here, or click to select</p>
              <p className='text-xs text-gray-400 mt-2'>
                (Max file size: {Math.round(maxSize / 1048576)}MB)
              </p>
            </div>
          )}
        </div>
      )}

      {fileRejectionItems}

      {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}

      {isUploading && (
        <div className='flex items-center gap-2 text-sm'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
};
