import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { SigninDTO, SignupDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignupDTO) {
    return await this.authservice.signup(data);
  }

  @Post('signin')
  async signin(@Body() data: SigninDTO) {
    return await this.authservice.signin(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.authservice.remove(Number(id));
  }
}
