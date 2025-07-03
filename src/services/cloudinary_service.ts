import axios from 'axios';

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Create form data for the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    // Make the request to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    // Return the secure URL from Cloudinary
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
