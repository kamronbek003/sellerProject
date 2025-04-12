import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ProductFilterDto {
  @ApiProperty({
    description: 'Mahsulot nomi bo‘yicha qidiruv (ixtiyoriy)',
    required: false,
    example: 'Atirgul',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Mahsulot rangi bo‘yicha qidiruv (ixtiyoriy)',
    required: false,
    example: 'Qizil',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Minimal narx (ixtiyoriy)',
    required: false,
    example: '10000',
  })
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiProperty({
    description: 'Maksimal narx (ixtiyoriy)',
    required: false,
    example: '100000',
  })
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @ApiProperty({
    description: 'Kategoriya IDsi bo‘yicha qidiruv (ixtiyoriy)',
    required: false,
    example: 'uuid-string',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Sahifa raqami (ixtiyoriy, default: 1)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Har bir sahifadagi elementlar soni (ixtiyoriy, default: 10)',
    required: false,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Saralash maydoni (ixtiyoriy, default: "name")',
    required: false,
    example: 'name',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @ApiProperty({
    description: 'Saralash tartibi (ixtiyoriy, default: "asc")',
    required: false,
    enum: SortOrder,
    example: 'asc',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}