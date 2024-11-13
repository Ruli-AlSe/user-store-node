import { ProductModel } from '../../data';
import { CreateProductDto, CustomError, PaginationDto } from '../../domain';

export class ProductService {
  constructor() {}

  async createProduct(createProductDto: CreateProductDto) {
    const productExists = await ProductModel.findOne({ name: createProductDto.name });
    if (productExists) throw CustomError.badRequest('Product already exists');

    try {
      const product = new ProductModel({ ...createProductDto });
      await product.save();

      return {
        id: product.id,
        name: product.name,
        available: product.available,
      };
    } catch (error) {
      console.error({ error });
      throw CustomError.internalServerError(`${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [products, totalProducts] = await Promise.all([
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user')
          .populate('category'),
        ProductModel.countDocuments(),
      ]);

      return {
        page,
        limit,
        total: totalProducts,
        next: page * limit < totalProducts ? `/api/products?page=${page + 1}&limit=${limit}` : null,
        prev: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        products,
      };
    } catch (error) {
      console.error({ error });
      throw CustomError.internalServerError('Internal server error');
    }
  }
}
