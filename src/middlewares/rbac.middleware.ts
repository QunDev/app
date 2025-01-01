// `src/middlewares/rbac.middleware.ts`
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '~/core/error.response.ts';

export const checkRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user.roles; // Assume `req.user` contains user info with roles
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return next(new ForbiddenError('You do not have the required role to access this resource.'));
    }

    next();
  };
};