import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const accessKey = process.env.ACCESS_KEY;    
    if (!accessKey) {
      throw new Error('ACCESS_KEY environment variable is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessKey,
    });
  }

  async validate(payload: { id: string; role: string }) {
    const { id, role } = payload;

    const user = await this.prisma.seller.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    if (user.isActive !== 'ACTIVE') {
      throw new UnauthorizedException('Foydalanuvchi faol emas');
    }

    return { id: user.id, role };
  }
}