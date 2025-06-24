import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [AuthModule, CategoryModule, PostModule, GenerateModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
