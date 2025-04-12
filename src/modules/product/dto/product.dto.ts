import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Mahsulot nomi',
    example: 'Qizil atirgul',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Mahsulot haqida qisqacha ma‘lumot',
    example: 'Bu qizil atirgul, juda chiroyli va xushbo‘y.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Mahsulot rangi',
    example: 'Qizil',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'Mahsulot rasmi URL manzili',
    example: 'https://example.com/images/red-rose.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Mahsulot narxi (string sifatida, lekin raqam bo‘lishi kerak)',
    example: '50000',
  })
  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'Mahsulot kategoriyasi IDsi',
    example: 'uuid-string',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Mahsulot nomi (ixtiyoriy)',
    example: 'Qizil atirgul',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Mahsulot haqida qisqacha ma‘lumot (ixtiyoriy)',
    example: 'Bu qizil atirgul, juda chiroyli va xushbo‘y.',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    description: 'Mahsulot rangi (ixtiyoriy)',
    example: 'Qizil',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  color?: string;

  @ApiProperty({
    description: 'Mahsulot rasmi URL manzili (ixtiyoriy)',
    example: 'https://example.com/images/red-rose.jpg',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  image?: string;

  @ApiProperty({
    description: 'Mahsulot narxi (ixtiyoriy, string sifatida, lekin raqam bo‘lishi kerak)',
    example: '50000',
    required: false,
  })
  @IsNumberString()
  @IsNotEmpty()
  price?: string;

  @ApiProperty({
    description: 'Mahsulot kategoriyasi IDsi (ixtiyoriy)',
    example: 'uuid-string',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  categoryId?: string;
}