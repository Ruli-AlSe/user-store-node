import { CategoryModel } from '../../data';
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from '../../domain';

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
    if (categoryExists) throw CustomError.badRequest('Category already exists');

    try {
      const category = new CategoryModel({ ...createCategoryDto, user: user.id });
      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      console.error({ error });
      throw CustomError.internalServerError(`${error}`);
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [categories, totalCategories] = await Promise.all([
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
        CategoryModel.countDocuments(),
      ]);

      return {
        page,
        limit,
        total: totalCategories,
        next:
          page * limit < totalCategories ? `/api/categories?page=${page + 1}&limit=${limit}` : null,
        prev: page > 1 ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error) {
      console.error({ error });
      throw CustomError.internalServerError('Internal server error');
    }
  }
}
