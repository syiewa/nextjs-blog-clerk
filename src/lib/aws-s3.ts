import { S3 } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: "us-west-2",
});

interface UploadOptions {
  onProgress?: (progress: { loaded: number; total: number }) => void;
}

export async function uploadImageS3(file: File, options: UploadOptions = {}) {
  const fileName = new Date().getTime() + "-" + file.name;
  const bufferedImage = await file.arrayBuffer();
  const totalSize = file.size;
  let loadedSize = 0;

  try {
    const command = new PutObjectCommand({
      Bucket: "nextjs-training",
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: file.type,
    });

    // Simulate progress tracking
    const uploadPromise = s3.send(command);

    // Optional progress tracking
    if (options.onProgress) {
      const intervalId = setInterval(() => {
        loadedSize = Math.min(loadedSize + totalSize * 0.1, totalSize);
        options.onProgress!({ loaded: loadedSize, total: totalSize });

        if (loadedSize >= totalSize) {
          clearInterval(intervalId);
        }
      }, 100);
    }

    await uploadPromise;

    const url = await getImageS3(fileName);
    return { presignedUrl: url, fileName: fileName };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Error uploading image to S3");
  }
}

export async function getImageS3(filename: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: "nextjs-training",
      Key: filename,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 900 });
    return url;
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    throw new Error("Error fetching image from S3");
  }
}
