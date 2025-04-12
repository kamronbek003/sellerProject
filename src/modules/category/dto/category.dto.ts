import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Kategoriya nomi',
    example: 'Gullar',
  })
  @IsString()
  @IsNotEmpty({ message: `Kategoriya nomi bo‘sh bo‘lmasligi kerak` })
  name: string;

  @ApiProperty({
    description: 'Kategoriya rasmi uchun URL',
    example: 'https://example.com/images/flowers.jpg',
  })
  @IsUrl({}, { message: `Rasm URL manzili noto‘g‘ri` })
  @IsNotEmpty({ message: `Rasm URL manzili bo‘sh bo‘lmasligi kerak` })
  image: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Kategoriya nomi (ixtiyoriy)',
    example: 'Yangi Gullar',
    required: false,
  })
  @IsString()
  @IsNotEmpty({ message: `Kategoriya nomi bo‘sh bo‘lmasligi kerak` })
  name?: string;

  @ApiProperty({
    description: 'Kategoriya rasmi uchun URL (ixtiyoriy)',
    example: 'https://example.com/images/new-flowers.jpg',
    required: false,
  })
  @IsUrl({}, { message: `Rasm URL manzili noto‘g‘ri` })
  image?: string;
}