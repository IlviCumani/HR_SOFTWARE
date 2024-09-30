import {
  ConflictException,
  Controller,
  Get,
  Query,
  Redirect,
} from '@nestjs/common';
import { google } from 'googleapis';
import { UserService } from '../../users/users.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/users/schemas/user.schema';
import { GmailApiService } from './gmail-api.service';

@Roles([Role.HR, Role.CEO])
@Controller('auth')
export class AuthController {
  private readonly oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  constructor(
    private readonly userService: UserService,
    private readonly gmailApiService: GmailApiService,
  ) {}

  @Get('authorize')
  @Redirect()
  authorize() {
    try {
      const scopes = [process.env.GOOGLE_CLIENT_SCOPE];
      const url = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
      });
      return { url };
    } catch (error) {
      throw new ConflictException('Failed to generate authorization URL');
    }
  }

  @Get('callback')
  @Redirect()
  async callback(@Query('code') code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      const refreshToken = tokens.access_token;

      if (!refreshToken) {
        throw new ConflictException('No refresh token returned');
      }

      await this.userService.saveRefreshToken(
        'alice11.johnson@codevider.com',
        refreshToken,
      );

      return {
        url: `${process.env.FRONTEND_URL}?auth=success`,
      };
    } catch (error) {
      console.error('Error exchanging authorization code:', error);
      throw new ConflictException(
        'Failed to exchange authorization code for tokens',
        error,
      );
    }
  }

  @Get('check-refresh-token')
  async checkRefreshToken(
    @Query('email') email: string,
    @Query('subject') subject: string = null,
    @Query('startDate') startDate: string = null,
  ) {
    const user = await this.userService.getUserByEmail(email);
    console.log('user', user);
    if (!user || !user.refreshToken) {
      console.log("we don't have a fresh tokens");
      const url = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [process.env.GOOGLE_CLIENT_SCOPE],
      });
      return { url, message: 'No refresh token, redirecting to authorization' };
    }

    this.oauth2Client.setCredentials({ refresh_token: user.refreshToken });

    try {
      await this.oauth2Client.getAccessToken();
      console.log('Refresh token is valid');

      console.log('subject,', subject);
      console.log('startDate,', startDate);

      const res = await this.gmailApiService.fetchAndSaveEmails(
        subject,
        startDate,
        user.refreshToken,
      );

      console.log('hellooooo pipelellelel', res);

      return {
        message: 'Refresh token is valid, emails fetched and saved',
        url: `${process.env.FRONTEND_URL}?data=fetched`,
      };
    } catch (error) {
      const url = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [process.env.GOOGLE_CLIENT_SCOPE],
      });
      return {
        url,
        message: 'Refresh token is expired, redirecting to authorization',
      };
    }
  }
}
