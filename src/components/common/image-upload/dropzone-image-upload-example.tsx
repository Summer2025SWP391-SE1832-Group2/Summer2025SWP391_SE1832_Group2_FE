import { useState } from 'react';
import { DropzoneImageUpload } from './dropzone-image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DropzoneImageUploadExample = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    console.log('Image uploaded:', url);
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Dropzone Image Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <DropzoneImageUpload
          onImageUploaded={handleImageUploaded}
          defaultImage={imageUrl}
          className='w-full'
        />

        {imageUrl && (
          <div className='mt-4'>
            <p className='text-sm font-medium mb-1'>Uploaded Image URL:</p>
            <p className='text-xs text-gray-500 break-all'>{imageUrl}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
