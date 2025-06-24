import { Controller, Post, UseGuards } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('generate')
export class GenerateController {
  constructor(private generateService: GenerateService) {}
  @Post('notice')
  generateText() {
    return this.generateService.generate();
  }
}
