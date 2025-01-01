import {asyncHandler} from "~/helper/errorHandle.ts";
import {Request, Response, NextFunction} from "express";

export const downloadBackup = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { filename } = req.params;
  const { appname } = req.query;

  if (!filename) {
    throw new Error('Filename is required');
  }

  if (!appname) {
    throw new Error('App name is required');
  }

  next();
})