import {prisma} from '~/utils/prismaClient';

export class ApiKeyRepository {
  /**
   * Saves a new API key entry in the database.
   * @param apiKeyData - Object containing data to save in the database.
   * @returns The newly created API key record.
   */
  static async createApiKey(apiKeyData: {
    key: string;
    serviceName: string | null;
    userId: number | null;
    rateLimit: number | null;
    expiresAt: Date | null;
    status: 'ACTIVE';
  }) {
      return prisma.apiKey.create({
        data: apiKeyData,
      });
  }

  public static getApiKeyByKey(key: string) {
    return prisma.apiKey.findUnique({
      where: {key: key},
    });
  }

  public static updateUsageCountApiKeyById(id: number) {
    return prisma.apiKey.update({
      where: {id: id},
      data: {
        usageCount: {
          increment: 1, // Increment the usage count by 1
        },
        lastUsedAt: new Date(), // Update the last used timestamp
      },
    });
  }
}