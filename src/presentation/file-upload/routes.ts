import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UploadFileController } from './controller';

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UploadFileController();

    router.post('/single/:type', controller.uploadFile);
    router.post('/multiple/:type', controller.uploadMultipleFiles);

    return router;
  }
}