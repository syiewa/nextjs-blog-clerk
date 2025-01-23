
export async function initCloudinary() {
  // if (!cloudinary) {
    const cloudinary = await import('cloudinary');
    
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    });
  // }
  return cloudinary.v2;
}

export async function uploadImage(image: File | null): Promise<string | undefined> {
  if (!image) {
    return;
  }

  try {
    const cloudinaryV2 = await initCloudinary();
    
    const imageData = await image.arrayBuffer();
    const mime = image.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(imageData).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const result = await cloudinaryV2.uploader.upload(fileUri, {
      folder: 'nextjs-course-mutations',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}