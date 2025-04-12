import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryFilterDto } from './dto/category-filter.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, sellerId: string) {
    const { name, image } = createCategoryDto;

    // Kategoriya nomining mavjudligini tekshirish
    const existingCategory = await this.prisma.category.findFirst({
      where: { name, sellerId },
    });
    if (existingCategory) {
      throw new ConflictException(`Bu nomdagi kategoriya allaqachon mavjud`);
    }

    return this.prisma.category.create({
      data: {
        name,
        image,
        sellerId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        sellerId: true,
      },
    });
  }

  async findAll(sellerId: string, filters: CategoryFilterDto) {
    const { name, page, limit, sortBy, sortOrder } = filters;

    const skip = (Number(page) - 1) * Number(limit);
    const take = limit;

    const where: any = {
      sellerId,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const total = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: {
        [String(sortBy)]: sortOrder, // Saralash: masalan, { name: 'asc' }
      },
      select: {
        id: true,
        name: true,
        image: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string, sellerId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, sellerId },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException(`Kategoriya topilmadi`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, sellerId: string) {
    const { name, image } = updateCategoryDto;

    // Kategoriya mavjudligini tekshirish
    const category = await this.prisma.category.findFirst({
      where: { id, sellerId },
    });
    if (!category) {
      throw new NotFoundException(`Kategoriya topilmadi`);
    }

    // Yangi nom mavjudligini tekshirish
    if (name && name !== category.name) {
      const existingCategory = await this.prisma.category.findFirst({
        where: { name, sellerId },
      });
      if (existingCategory) {
        throw new ConflictException(`Bu nomdagi kategoriya allaqachon mavjud`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: { name, image },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
  }

  async remove(id: string, sellerId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, sellerId },
    });
    if (!category) {
      throw new NotFoundException(`Kategoriya topilmadi`);
    }

    // Kategoriyaga bog‘liq mahsulotlar mavjudligini tekshirish
    const products = await this.prisma.product.findMany({
      where: { categoryId: id },
    });
    if (products.length > 0) {
      throw new ConflictException(
        `Bu kategoriyada mahsulotlar mavjud, avval ularni o‘chirish kerak`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: `Kategoriya muvaffaqiyatli o‘chirildi` };
  }
}