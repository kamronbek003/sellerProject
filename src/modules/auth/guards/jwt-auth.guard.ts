import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    console.log('Request Headers:', request.headers); 
    console.log('Authorization Header:', request.headers.authorization);

    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);

    if (err || !user) {
      throw err || new UnauthorizedException('Autentifikatsiya talab qilinadi yoki token noto‘g‘ri');
    }
    return user;
  }
}