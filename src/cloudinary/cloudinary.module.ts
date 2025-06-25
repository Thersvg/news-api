import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryConfig } from './cloudinary.config';

@Module({
  providers: [CloudinaryConfig, CloudinaryService],
  controllers: [CloudinaryController],
  exports: ['CLOUDINARY', CloudinaryService],
})
export class CloudinaryModule {}
