import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Mahsulotlar')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create: Yangi mahsulot yaratish
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Yangi mahsulot yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Mahsulot muvaffaqiyatli yaratildi',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        name: { type: 'string', example: 'Qizil atirgul' },
        description: { type: 'string', example: 'Bu qizil atirgul, juda chiroyli va xushbo‘y.' },
        color: { type: 'string', example: 'Qizil' },
        image: { type: 'string', example: 'https://example.com/images/red-rose.jpg' },
        price: { type: 'string', example: '50000' },
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-string' },
            name: { type: 'string', example: 'Gullar' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 404,
    description: 'Kategoriya topilmadi',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu kategoriya sizga tegishli emas',
  })
  @ApiBody({ type: CreateProductDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productService.create(createProductDto, req.user.id);
  }

  // FindAll: Barcha mahsulotlarni olish
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
  @ApiResponse({
    status: 200,
    description: 'Mahsulotlar ro‘yxati',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-string' },
              name: { type: 'string', example: 'Qizil atirgul' },
              description: { type: 'string', example: 'Bu qizil atirgul, juda chiroyli va xushbo‘y.' },
              color: { type: 'string', example: 'Qizil' },
              image: { type: 'string', example: 'https://example.com/images/red-rose.jpg' },
              price: { type: 'string', example: '50000' },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'uuid-string' },
                  name: { type: 'string', example: 'Gullar' },
                },
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 50 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiQuery({ name: 'name', required: false, description: 'Mahsulot nomi bo‘yicha qidiruv', example: 'Atirgul' })
  @ApiQuery({ name: 'color', required: false, description: 'Mahsulot rangi bo‘yicha qidiruv', example: 'Qizil' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimal narx', example: '10000' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maksimal narx', example: '100000' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Kategoriya IDsi bo‘yicha qidiruv', example: 'uuid-string' })
  @ApiQuery({ name: 'page', required: false, description: 'Sahifa raqami', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Har bir sahifadagi elementlar soni', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Saralash maydoni', example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Saralash tartibi', example: 'asc' })
  @Get()
  findAll(@Request() req, @Query() filters: ProductFilterDto) {
    return this.productService.findAll(req.user.id, filters);
  }

  // FindOne: Bitta mahsulotni olish
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Bitta mahsulotni olish' })
  @ApiResponse({
    status: 200,
    description: 'Mahsulot ma‘lumotlari',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        name: { type: 'string', example: 'Qizil atirgul' },
        description: { type: 'string', example: 'Bu qizil atirgul, juda chiroyli va xushbo‘y.' },
        color: { type: 'string', example: 'Qizil' },
        image: { type: 'string', example: 'https://example.com/images/red-rose.jpg' },
        price: { type: 'string', example: '50000' },
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-string' },
            name: { type: 'string', example: 'Gullar' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 404,
    description: 'Mahsulot topilmadi',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu mahsulot sizga tegishli emas',
  })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi', example: 'uuid-string' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.productService.findOne(id, req.user.id);
  }

  // Update: Mahsulotni yangilash
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Mahsulot muvaffaqiyatli yangilandi',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        name: { type: 'string', example: 'Qizil atirgul' },
        description: { type: 'string', example: 'Bu qizil atirgul, juda chiroyli va xushbo‘y.' },
        color: { type: 'string', example: 'Qizil' },
        image: { type: 'string', example: 'https://example.com/images/red-rose.jpg' },
        price: { type: 'string', example: '50000' },
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-string' },
            name: { type: 'string', example: 'Gullar' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 404,
    description: 'Mahsulot yoki yangi kategoriya topilmadi',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu mahsulot yoki yangi kategoriya sizga tegishli emas',
  })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi', example: 'uuid-string' })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productService.update(id, updateProductDto, req.user.id);
  }

  // Remove: Mahsulotni o‘chirish
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mahsulotni o‘chirish' })
  @ApiResponse({
    status: 200,
    description: 'Mahsulot muvaffaqiyatli o‘chirildi',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Mahsulot muvaffaqiyatli o‘chirildi' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 404,
    description: 'Mahsulot topilmadi',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu mahsulot sizga tegishli emas yoki bog‘langan buyurtmalar mavjud',
  })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi', example: 'uuid-string' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productService.remove(id, req.user.id);
  }
}