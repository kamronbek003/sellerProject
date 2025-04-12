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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryFilterDto } from './dto/category-filter.dto';

@ApiTags('Kategoriyalar')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token') // 'access-token' nomi qo‘shildi
  @ApiOperation({ summary: 'Yangi kategoriya yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Kategoriya muvaffaqiyatli yaratildi',
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu nomdagi kategoriya allaqachon mavjud',
  })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return this.categoryService.create(createCategoryDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Barcha kategoriyalarni olish' })
  @ApiResponse({
    status: 200,
    description: 'Kategoriyalar ro‘yxati',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-string' },
              name: { type: 'string', example: 'Gullar' },
              image: { type: 'string', example: 'https://example.com/images/flowers.jpg' },
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'uuid-string' },
                    name: { type: 'string', example: 'Qizil atirgul' },
                    price: { type: 'number', example: 50000 },
                  },
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
  @ApiQuery({ name: 'name', required: false, description: 'Kategoriya nomi bo‘yicha qidiruv', example: 'Gullar' })
  @ApiQuery({ name: 'page', required: false, description: 'Sahifa raqami', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Har bir sahifadagi elementlar soni', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Saralash maydoni', example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Saralash tartibi', example: 'asc' })
  @Get()
  findAll(@Request() req, @Query() filters: CategoryFilterDto) {
    return this.categoryService.findAll(req.user.id, filters);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Bitta kategoriyani olish' })
  @ApiResponse({
    status: 200,
    description: 'Kategoriya ma‘lumotlari',
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 404,
    description: 'Kategoriya topilmadi',
  })
  @ApiParam({ name: 'id', description: 'Kategoriya IDsi', example: 'uuid-string' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.categoryService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Kategoriyani yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Kategoriya muvaffaqiyatli yangilandi',
    type: UpdateCategoryDto,
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
    description: 'Bu nomdagi kategoriya allaqachon mavjud',
  })
  @ApiParam({ name: 'id', description: 'Kategoriya IDsi', example: 'uuid-string' })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req,
  ) {
    return this.categoryService.update(id, updateCategoryDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Kategoriyani o‘chirish' })
  @ApiResponse({
    status: 200,
    description: 'Kategoriya muvaffaqiyatli o‘chirildi',
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
    description:
      'Bu kategoriyada mahsulotlar mavjud, avval ularni o‘chirish kerak',
  })
  @ApiParam({ name: 'id', description: 'Kategoriya IDsi', example: 'uuid-string' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.categoryService.remove(id, req.user.id);
  }
}