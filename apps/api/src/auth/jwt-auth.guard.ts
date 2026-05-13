import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtService = new JwtService();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization as string | undefined;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    try {
      const secret = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret';
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
