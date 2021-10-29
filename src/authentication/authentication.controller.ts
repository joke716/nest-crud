import { Controller, Post, Body, UseGuards, Req, Res, HttpCode } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RequestWithUser } from './requestWithUser.interface';
import { RegisterDto } from './dto/Register.dto';
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import { Response } from "express";

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }


}
