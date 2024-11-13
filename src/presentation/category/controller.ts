import { Request, Response } from 'express';
import { CustomError } from '../../domain';

export class CategoryController {
  constructor() {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(` ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }

  async createCategory(req: Request, res: Response) {
    res.json('Create Category');
  }

  async getCategories(req: Request, res: Response) {
    res.json('Get Categories');
  }
}
