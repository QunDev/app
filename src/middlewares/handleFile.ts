import {NextFunction, Request, Response} from "express";
import busboy from "busboy";
import {asyncHandler} from "~/helper/errorHandle.ts";

export const handleFile = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    const bb = busboy({ headers: req.headers });
    req.raw = { files: {} };

    bb.on('file', (name, file, info) => {
      const { filename } = info;
      const fileData: any[] = [];
      file.on('data', (data) => fileData.push(data));
      file.on('end', () => {
        req.raw.files[name] = {
          filename,
          file: Buffer.concat(fileData),
          size: Buffer.concat(fileData).length,
        };
      });
    });

    bb.on('field', (name, value) => {
      req.body[name] = value;
    });

    bb.on('finish', () => {
      next();
    });

    req.pipe(bb);
  } else {
    next();
  }
});