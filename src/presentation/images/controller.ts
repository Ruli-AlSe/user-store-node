import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

export class ImageController {
  constructor() {}

  getImage = (req: Request, res: Response) => {
    const { type = '', image = '' } = req.params;

    const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${image}`);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Not found');
    }

    res.sendFile(imagePath);
  };
}
