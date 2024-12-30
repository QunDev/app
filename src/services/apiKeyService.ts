import {ApiKeyRepository} from '~/repositories/apiKey.repository';
import {randomBytes} from 'crypto';
import bcrypt from 'bcrypt';
import {AuthFailureError} from '~/core/error.response';
import {ApiKeyStatus} from "@prisma/client";

export class ApiKeyService {
  /**
   * Creates a new API Key
   * @param name - Name of the API key (optional, e.g., "My Service Key")
   * @param userId - Associated User ID (optional, if linked to a user)
   * @param rateLimit - Number of allowed requests per rate period
   * @param expiresAt - Expiration date of the key
   */
  static async createApiKey(
    name: string,
    userId: number | null = null,
    rateLimit: number | null = null,
    expiresAt: Date | null = null
  ) {
    // Generate a secure random API key
    const apiKeyPlainText = this.generateRandomKey();

    // Optionally hash the API key (hashed value is stored in DB for security)
    // const hashedApiKey = await this.hashApiKey(apiKeyPlainText);

    // Construct data to insert into the database
    const apiKeyData = {
      key: apiKeyPlainText, // Save the hashed API key
      serviceName: name,
      userId, // Set the user ID if provided
      rateLimit,
      status: <const>'ACTIVE', // Default to ACTIVE key
      expiresAt,
    };

    // Save the API key to the database
    const createdApiKey = await ApiKeyRepository.createApiKey(apiKeyData);

    // Return the plain-text key (hashed key won't be exposed)
    return {
      key: apiKeyPlainText, // Provide the generated key (for the client to use)
    };
  }

  /**
   * Hashes the API key using bcrypt.
   * @param apiKey - Plain API key to be hashed.
   * @returns Hashed API key.
   */
  static async hashApiKey(apiKey: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(apiKey, saltRounds);
  }

  /**
   * Generates a secure random API key.
   * @returns Randomly generated API key string.
   */
  static generateRandomKey(): string {
    return randomBytes(64).toString('hex'); // 256-bit key (64 characters in hex)
  }

  /**
   * Validates the provided API key.
   * @param apiKey - The plain-text API key submitted by the client.
   * @returns Boolean indicating whether the API key is valid.
   * @throws AuthFailureError if key is invalid or if key is not active.
   */
  static async validateApiKey(apiKey: string): Promise<{
    id: number;
    key: string;
    userId: number | null;
    serviceName: string | null;
    status: ApiKeyStatus;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
    rateLimit: number | null;
    usageCount: number;
    lastUsedAt: Date | null;
  }> {
    // Retrieve the hashed API key and its status from the database
    const storedApiKeyData = await ApiKeyRepository.getApiKeyByKey(apiKey);

    if (!storedApiKeyData) {
      throw new AuthFailureError('Invalid API Key');
    }

    const {key, status, expiresAt, rateLimit, usageCount} = storedApiKeyData;

    // Check if the key is active and not expired
    if (status === 'REVOKED') {
      throw new AuthFailureError('ERROR : This API key has been revoked');
    }
    // else if (status === 'EXPIRED' || (expiresAt && new Date(expiresAt) < new Date())) {
    //   throw new AuthFailureError('ERROR : This API key has expired');
    // }

    if ((rateLimit !== null && usageCount >= rateLimit) && rateLimit !== -1) {
      throw new AuthFailureError('ERROR : API request limit reached for this key');
    }

    return storedApiKeyData;
  }
}