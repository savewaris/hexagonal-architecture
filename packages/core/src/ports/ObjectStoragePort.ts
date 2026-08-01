export interface UploadFileOptions {
  bucket: string;
  key: string;
  content: string | Buffer;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadFileResult {
  bucket: string;
  key: string;
  url: string;
  sizeBytes: number;
}

/**
 * Output Port Interface for Cloud Object Storage (AWS S3, Cloudflare R2, Google Cloud Storage).
 * Decouples media uploads and document storage from specific cloud vendor APIs.
 */
export interface ObjectStoragePort {
  uploadFile(options: UploadFileOptions): Promise<UploadFileResult>;
  getPresignedUrl(bucket: string, key: string, expiresInSeconds?: number): Promise<string>;
  deleteFile(bucket: string, key: string): Promise<boolean>;
}
