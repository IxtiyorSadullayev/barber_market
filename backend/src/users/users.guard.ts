import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request = context.switchToHttp().getRequest();
    // console.log('UsersGuard is working', request.headers.authorization);
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false; 
    }
    const token= authHeader.split(' ')[1].trim()
    if (!token) {
      throw new HttpException('Token topilmadi', HttpStatus.UNAUTHORIZED);
    }
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
    } catch (error) {
      throw new HttpException('Token noto\'g\'ri', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
