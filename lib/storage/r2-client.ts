import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

if (
  !process.env.R2_ACCOUNT_ID ||
  !process.env.R2_ACCESS_KEY_ID ||
  !process.env.R2_SECRET_ACCESS_KEY
) {
  throw new Error('R2 environment variables are required');
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export class R2StorageClient {
  private bucketName = process.env.R2_BUCKET_NAME!;

  async uploadVideo(key: string, videoBuffer: Buffer, contentType = 'video/mp4') {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: videoBuffer,
      ContentType: contentType,
    });

    await r2Client.send(command);
    return `https://${this.bucketName}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
  }

  async getSignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
  }

  async deleteVideo(key: string) {
    // Implementation for deleting videos if needed
  }
}

export const r2Storage = new R2StorageClient();
