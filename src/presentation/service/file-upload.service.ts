import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from '../../config';
import { CustomError } from '../../domain';

export class FileUploadService {
  constructor(private readonly uuid = Uuid.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  public async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {
    try {
      const fileExtension = file.mimetype.split('/').at(1) ?? '';

      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(
          `Invalid extension: ${fileExtension}, valid ones ${validExtensions}`
        );
      }

      const destinantion = path.resolve(__dirname, '../../../', folder);
      this.checkFolder(destinantion);
      const fileName = `${this.uuid()}.${fileExtension}`;

      file.mv(`${destinantion}/${fileName}`);

      return { fileName };
    } catch (error) {
      throw CustomError.internalServerError('Error uploading file');
    }
  }

  public uploadMultiple(
    files: any,
    folder: string,
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {}
}
