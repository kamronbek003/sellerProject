import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsISO8601,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class RegisterSellerDto {
  @ApiProperty({ description: "Sotuvchining ismi", example: 'Ali' })
  @IsString({ message: "Ism matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: 'Ism kiritilishi majburiy.' })
  @MaxLength(50, { message: "Ism 50 belgidan oshmasligi kerak." })
  firstName: string;

  @ApiProperty({ description: "Sotuvchining familiyasi", example: 'Valiyev' })
  @IsString({ message: "Familiya matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: 'Familiya kiritilishi majburiy.' })
  @MaxLength(50, { message: "Familiya 50 belgidan oshmasligi kerak." })
  lastName: string;

  @ApiProperty({
    description: "Sotuvchining O'zbekiston formatidagi (+998...) telefon raqami",
    example: '+998901234567',
  })
  @IsString({ message: "Telefon raqami matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi majburiy.' })
  @IsPhoneNumber('UZ', { message: "Telefon raqami O'zbekiston formatida bo'lishi kerak (masalan, +998XX XXX XX XX)." })
  phone: string;

  @ApiProperty({
    description: "Sotuvchining do'kon nomi",
    example: 'Vali Market',
  })
  @IsString({ message: "Do'kon nomi matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "Do'kon nomi kiritilishi majburiy." })
  @MaxLength(100, { message: "Do'kon nomi 100 belgidan oshmasligi kerak." })
  nameOfStore: string;

  @ApiProperty({
    description: "Sotuvchining tug'ilgan sanasi (YYYY-MM-DD formati)",
    example: '1995-08-15',
  })
  @IsString({ message: "Tug'ilgan sana matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "Tug'ilgan sana kiritilishi majburiy." })
  @IsISO8601({ strict: true }, { message: "Tug'ilgan sana YYYY-MM-DD formatida bo'lishi kerak." })
  dateBirth: string;

  @ApiProperty({
    description: "Do'kon rasmining manzili (URL)",
    example: 'https://example.com/images/store.jpg',
  })
  @IsString({ message: "Rasm manzili matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "Rasm manzili kiritilishi majburiy." })
  @IsUrl({}, { message: "Rasm manzili yaroqli URL bo'lishi kerak." })
  image: string;

  @ApiProperty({
    description: "Do'kon logotipining manzili (URL)",
    example: 'https://example.com/images/logo.png',
  })
  @IsString({ message: "Logo manzili matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "Logo manzili kiritilishi majburiy." })
  @IsUrl({}, { message: "Logo manzili yaroqli URL bo'lishi kerak." })
  logo: string;

  @ApiProperty({
    description: "To'lov amalga oshirilgan vaqt (ISO 8601 formatida, masalan, YYYY-MM-DDTHH:mm:ss.sssZ)",
    example: '2025-04-07T13:57:25.123Z',
  })
  @IsString({ message: "To'lov vaqti matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "To'lov vaqti kiritilishi majburiy." })
  @IsISO8601({}, { message: "To'lov vaqti to'liq ISO 8601 formatida bo'lishi kerak." })
  paymentTime: string;

  @ApiProperty({
    description: "Telegram bot tokeni",
    example: '1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij',
  })
  @IsString({ message: "Bot token matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "Bot token kiritilishi majburiy." })
  botToken: string;

  @ApiProperty({
    description: "Yangi parol (kamida 6 belgi)",
    example: 'P@sswOrd123',
    minLength: 6,
  })
  @IsString({ message: "Parol matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: 'Parol kiritilishi majburiy.' })
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak." })
  password: string;
}