import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class SellerLoginDto {
  @ApiProperty({
    description: "Sotuvchining O'zbekiston formatidagi (+998...) telefon raqami",
    example: '+998945895766',
    type: String,
  })
  @IsString({ message: "Telefon raqami matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "Telefon raqami kiritilishi majburiy." })
  @IsPhoneNumber('UZ', { message: "Telefon raqami O'zbekiston formatida bo'lishi kerak (masalan, +998XX XXX XX XX)." })
  phone: string;

  @ApiProperty({
    description: "Sotuvchining paroli",
    example: 'Kamron03',
    minLength: 6,
    type: String,
  })
  @IsString({ message: "Parol matn (string) bo'lishi kerak." })
  @IsNotEmpty({ message: "Parol kiritilishi majburiy." })
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak." })
  password: string;
}