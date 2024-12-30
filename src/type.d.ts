import { ApiKey } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      apiKeyRecord?: ApiKey;
    }
  }
}