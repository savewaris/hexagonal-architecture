import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/**
 * Advanced First-Principles Core Engine: AES-256-GCM Encryption & PII Masking Engine.
 * Authenticated field-level encryption for sensitive data at rest & string masking helpers.
 */
export class CryptoEngine {
  private readonly key: Buffer;

  constructor(secretKey: string) {
    if (!secretKey || secretKey.trim().length === 0) {
      throw new Error('CryptoEngine requires a non-empty secretKey.');
    }
    // Derive a fixed 256-bit (32 byte) key using scrypt
    this.key = scryptSync(secretKey, 'crypto_engine_salt', 32);
  }

  public encrypt(plaintext: string): EncryptedPayload {
    const iv = randomBytes(12); // 96-bit IV recommended for AES-GCM
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      ciphertext: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
    };
  }

  public decrypt(payload: EncryptedPayload): string {
    const iv = Buffer.from(payload.iv, 'base64');
    const authTag = Buffer.from(payload.authTag, 'base64');
    const ciphertext = Buffer.from(payload.ciphertext, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
  }

  // --- Masking Helpers ---

  public static maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2) return email;

    const [username, domain] = parts;
    if (username.length <= 2) {
      return `${username[0]}*@${domain}`;
    }
    return `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}@${domain}`;
  }

  public static maskPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return phone;
    return `***-***-${digits.slice(-4)}`;
  }
}
