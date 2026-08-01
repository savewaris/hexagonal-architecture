import { ObjectStoragePort, UploadFileOptions, UploadFileResult } from '../../ports/ObjectStoragePort.js';

export interface S3StorageAdapterConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string; // Custom endpoint for Cloudflare R2 or MinIO
}

/**
 * Concrete Adapter implementing ObjectStoragePort for AWS S3 and Cloudflare R2.
 */
export class S3StorageAdapter implements ObjectStoragePort {
  private readonly region: string;
  private readonly endpoint?: string;

  constructor(config: S3StorageAdapterConfig) {
    if (!config.accessKeyId || !config.secretAccessKey) {
      throw new Error('S3StorageAdapter requires valid credentials.');
    }
    this.region = config.region;
    this.endpoint = config.endpoint;
  }

  public async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    const sizeBytes = typeof options.content === 'string'
      ? Buffer.byteLength(options.content)
      : options.content.length;

    const domain = this.endpoint ? this.endpoint.replace('https://', '') : `s3.${this.region}.amazonaws.com`;
    const url = `https://${options.bucket}.${domain}/${options.key}`;

    // Simulate AWS S3 PutObject Command
    return {
      bucket: options.bucket,
      key: options.key,
      url,
      sizeBytes,
    };
  }

  public async getPresignedUrl(bucket: string, key: string, expiresInSeconds = 3600): Promise<string> {
    const domain = this.endpoint ? this.endpoint.replace('https://', '') : `s3.${this.region}.amazonaws.com`;
    return `https://${bucket}.${domain}/${key}?X-Amz-Expires=${expiresInSeconds}&X-Amz-Signature=mock_sig`;
  }

  public async deleteFile(bucket: string, key: string): Promise<boolean> {
    // Simulate AWS S3 DeleteObject Command
    return true;
  }
}
