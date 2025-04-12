import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterSellerDto } from './dto/register.dto';
import { SellerLoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private accessKEY = process.env.ACCESS_KEY;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    // accessKEY mavjudligini tekshirish
    if (!this.accessKEY) {
      throw new Error('ACCESS_KEY environment variable is not set');
    }
  }

  async register(registerDto: RegisterSellerDto): Promise<string> {
    const { phone, password, ...rest } = registerDto;

    // Telefon raqam bo'yicha sotuvchi mavjudligini tekshirish
    const existingSellerByPhone = await this.prisma.seller.findFirst({
      where: { phone },
    });
    if (existingSellerByPhone) {
      throw new ConflictException(
        `Bu telefon raqamdan allaqachon foydalanilgan`,
      );
    }

    // Parolni heshlash
    let hashedPassword: string;
    try {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new InternalServerErrorException("Ro'yxatdan o'tishda xatolik!");
    }

    try {
      await this.prisma.seller.create({
        data: {
          ...rest,
          phone,
          password: hashedPassword,
          isActive: 'ACTIVE', 
        },
      });
      return `Tabriklaymiz, sotuvchi muvaffaqiyatli ro'yxatdan o'tkazildi!`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Sotuvchini ro'yxatdan o'tkazishda nimadir xato ketdi!`,
      );
    }
  }

  async login(loginDto: SellerLoginDto): Promise<{ accessToken: string }> {
    const { phone, password } = loginDto;

    try {
      const user = await this.prisma.seller.findFirst({ where: { phone } });

      if (!user) {
        throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri!");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri!");
      }

      // Access token 
      const accessToken = this.genAccessToken({
        id: user.id,
        role: 'seller',
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Nimadir xato ketdi, keyinroq qayta urinib ko'ring",
      );
    }
  }

  private genAccessToken(payload: { id: string; role: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.accessKEY,
      expiresIn: '10h',
    });
  }
}