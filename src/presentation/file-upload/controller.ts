import { Request, Response } from 'express';
import { CustomError } from '../../domain';

export class UploadFileController {
  constructor() {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(` ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  uploadFile = (req: Request, res: Response) => {
    res.json('upload file');
  };

  uploadMultipleFiles = (req: Request, res: Response) => {
    res.json('upload multiple files');
  };
}