import { ObjectId, Types } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { SignInData } from './interfaces/SignInData';
import { AuthResult } from './interfaces/AuthResult';

type AuthInput = { email: string; password: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signIn(user);
  }

  async validateUser(input: any): Promise<SignInData | null> {
    const user = await this.usersService.getUserByEmail(input.username);
    if (
      user &&
      (await this.usersService.validatePassword(user.password, input.password))
    ) {
      return {
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
        loginRole: user.loginRole,
        employID: user.employID,
        email: user.email,
      };
    }
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    console.log('Signing in user:', user);
    try {
      if (!user.role || !user.loginRole) {
        throw new UnauthorizedException('User roles are not defined.');
      }

      const tokenPayload = {
        sub: user._id,
        username: user.username,
        role: user.role,
        loginRole: user.loginRole,
        employID: user.employID,
      };

      const accessToken = this.jwtService.sign(tokenPayload, {});

      return {
        accessToken,
        _id: user._id,
        username: user.username,
        role: user.role,
        loginRole: user.loginRole,
        employID: user.employID,
        email: user.email,
      };
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw new UnauthorizedException(
        'Could not sign in. Please try again later.',
      );
    }
  }

  async verifyToken(token: string): Promise<SignInData | null> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.getUserByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return {
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
        loginRole: user.loginRole,
        employID: user.employID,
        email: user.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
