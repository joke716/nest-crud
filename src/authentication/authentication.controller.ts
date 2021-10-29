import {
  Req,
  Res,
  Get,
  Post,
  Controller,
  Body,
  UseGuards,
  HttpCode, SerializeOptions
} from "@nestjs/common";
import { AuthenticationService } from './authentication.service';
import { RequestWithUser } from './requestWithUser.interface';
import { RegisterDto } from './dto/Register.dto';
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import { Response } from "express";
import JwtAuthenticationGuard from "./jwt-authentication.guard";

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
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }


}
