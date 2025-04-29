
// Mock version of cloudinary for browser environments
const cloudinaryMock = {
  config: () => {},
  uploader: {
    upload: async () => ({
      public_id: 'sample',
      url: 'https://res.cloudinary.com/demo/image/upload/sample'
    }),
  },
  url: (publicId: string, options: any) => `https://res.cloudinary.com/demo/image/upload/${publicId}`
};

// Upload image function
export const uploadImage = async (file: string) => {
  try {
    console.log('Mock cloudinary upload in browser environment');
    return {
      public_id: 'sample',
      secure_url: 'https://res.cloudinary.com/demo/image/upload/sample'
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get optimized URL
export const getOptimizedUrl = (publicId: string) => {
  return `https://res.cloudinary.com/demo/image/upload/${publicId}`;
};

export default cloudinaryMock;
