import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Put,
  Body,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportJwtAuthGuard } from './guards/passport-jwt.guard';
import { Public } from 'src/decorators/public.decorator';
import { AuthenticatedRequest } from './interfaces/AuthRequest';

@Controller('')
export class PassportAuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('/login')
  async login(@Body() request: { email: string; password: string }) {
    const result = await this.authService.authenticate(request);
    return result;
  }

  @Public()
  @Get('verify')
  @UseGuards(PassportJwtAuthGuard)
  async verifyToken(@Req() request: AuthenticatedRequest) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      const user = await this.authService.verifyToken(token);
      return { user };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
