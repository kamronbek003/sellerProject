import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductFilterDto, SortOrder } from './dto/product-filter.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Create: Yangi mahsulot yaratish
  async create(createProductDto: CreateProductDto, sellerId: string) {
    // Kategoriyaning mavjudligini tekshirish
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    // Kategoriya ushbu sotuvchiga tegishli ekanligini tekshirish
    if (category.sellerId !== sellerId) {
      throw new ConflictException('Bu kategoriya sizga tegishli emas');
    }

    // Mahsulotni yaratish
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        categoryId: createProductDto.categoryId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        image: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // FindAll: Barcha mahsulotlarni olish (filterlar, pagination, ordering bilan)
  async findAll(sellerId: string, filters: ProductFilterDto) {
    const { name, color, minPrice, maxPrice, categoryId, page, limit, sortBy, sortOrder } = filters;

    // Pagination parametrlari
    const skip = (Number(page) - 1) * Number(limit);
    const take = limit;

    // Filterlar
    const where: any = {
      category: {
        sellerId, // Faqat ushbu sotuvchiga tegishli mahsulotlar
      },
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (color) {
      where.color = {
        contains: color,
        mode: 'insensitive',
      };
    }

    if (minPrice) {
      where.price = {
        gte: minPrice, // Narx >= minPrice
      };
    }

    if (maxPrice) {
      where.price = {
        ...where.price,
        lte: maxPrice, // Narx <= maxPrice
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Umumiy mahsulotlar sonini hisoblash (pagination uchun)
    const total = await this.prisma.product.count({ where });

    // Mahsulotlarni olish
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        [String(sortBy)]: sortOrder, // Saralash: masalan, { name: 'asc' }
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        image: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // FindOne: Bitta mahsulotni olish
  async findOne(id: string, sellerId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        image: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    // Mahsulot ushbu sotuvchiga tegishli ekanligini tekshirish
    const category = await this.prisma.category.findFirst({
      where: { id: product.category.id },
    });
    if (category?.sellerId !== sellerId) {
      throw new ConflictException('Bu mahsulot sizga tegishli emas');
    }

    return product;
  }

  // Update: Mahsulotni yangilash
  async update(id: string, updateProductDto: UpdateProductDto, sellerId: string) {
    // Mahsulotning mavjudligini tekshirish
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    // Mahsulot ushbu sotuvchiga tegishli ekanligini tekshirish
    const category = await this.prisma.category.findUnique({
      where: { id: product.categoryId },
    });
    if (category?.sellerId !== sellerId) {
      throw new ConflictException('Bu mahsulot sizga tegishli emas');
    }

    // Agar categoryId yangilansa, yangi kategoriyani tekshirish
    if (updateProductDto.categoryId) {
      const newCategory = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });
      if (!newCategory) {
        throw new NotFoundException('Yangi kategoriya topilmadi');
      }
      if (newCategory.sellerId !== sellerId) {
        throw new ConflictException('Yangi kategoriya sizga tegishli emas');
      }
    }

    // Mahsulotni yangilash
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        image: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Remove: Mahsulotni o‘chirish
  async remove(id: string, sellerId: string) {
    // Mahsulotning mavjudligini tekshirish
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true, // Bog‘langan buyurtmalar bor-yo‘qligini tekshirish
      },
    });
    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    // Mahsulot ushbu sotuvchiga tegishli ekanligini tekshirish
    const category = await this.prisma.category.findUnique({
      where: { id: product.categoryId },
    });
    if (category?.sellerId !== sellerId) {
      throw new ConflictException('Bu mahsulot sizga tegishli emas');
    }

    // Agar mahsulotga bog‘langan buyurtmalar bo‘lsa, o‘chirishni taqiqlash
    if (product.orderItems.length > 0) {
      throw new ConflictException(
        'Bu mahsulotga bog‘langan buyurtmalar mavjud, avval ularni o‘chirish kerak',
      );
    }

    // Mahsulotni o‘chirish
    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Mahsulot muvaffaqiyatli o‘chirildi' };
  }
}