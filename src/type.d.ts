import { User } from '~/models/user.model';

declare global {
  namespace Express {
    export interface Request {
      user?: User;

    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    raw?: {
      files?: {
        file?: {
          filename: string;
          file: NodeJS.ReadableStream;
          size: number;
        };
      };
    };
  }
}