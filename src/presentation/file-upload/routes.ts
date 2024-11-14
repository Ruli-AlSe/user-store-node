import { Router } from 'express';

import { UploadFileController } from './controller';
import { FileUploadService } from '../service/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const fileUploadService = new FileUploadService();
    const controller = new UploadFileController(fileUploadService);

    router.use(FileUploadMiddleware.containFiles);

    router.post('/single/:type', controller.uploadFile);
    router.post('/multiple/:type', controller.uploadMultipleFiles);

    return router;
  }
}
