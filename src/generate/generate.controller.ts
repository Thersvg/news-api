import { Controller, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
  constructor(private generateService: GenerateService) {}
  @Post('notice')
  generateText() {
    return this.generateService.generate();
  }
}
