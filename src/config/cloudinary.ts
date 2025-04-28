
import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
  cloud_name: 'demydfzpo',
  api_key: '237256498988464',
  api_secret: process.env.CLOUDINARY_SECRET || '', // Replace with your actual API secret
});

// Upload image function
export const uploadImage = async (file: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get optimized URL
export const getOptimizedUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto'
  });
};

export default cloudinary;
