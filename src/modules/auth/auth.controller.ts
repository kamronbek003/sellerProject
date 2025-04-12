import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSellerDto } from './dto/register.dto';
import { SellerLoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Sotuvchini ro'yxatdan o'tkazish" })
  @ApiResponse({ status: 201, description: "Muvaffaqiyatli ro'yxatdan o'tdi." })
  @ApiResponse({ status: 409, description: 'Bu telefon raqami allaqachon mavjud.' })
  @ApiResponse({ status: 400, description: "Yaroqsiz ma'lumotlar (DTO validatsiyasi)." })
  @ApiResponse({ status: 500, description: 'Ichki server xatoligi.' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: RegisterSellerDto): Promise<string> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Sotuvchini tizimga kiritish' })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli tizimga kirildi.',
    type: Object, // Response sifatida { accessToken: string } qaytadi
  })
  @ApiResponse({ status: 401, description: "Telefon raqam yoki parol noto'g'ri." })
  @ApiResponse({ status: 400, description: "Yaroqsiz ma'lumotlar (DTO validatsiyasi)." })
  @ApiResponse({ status: 500, description: 'Ichki server xatoligi.' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(
    @Body() loginDto: SellerLoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}