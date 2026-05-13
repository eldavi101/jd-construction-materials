import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { JwtPayload } from './auth.types';

type RegisterBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

type LoginBody = {
  email: string;
  password: string;
};

type RefreshBody = {
  refreshToken: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginBody) {
    return this.authService.login(body);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() body: RefreshBody) {
    return this.authService.refresh(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.me(user.sub);
  }
}
