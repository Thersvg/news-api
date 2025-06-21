import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthModule, CategoryModule, PostModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
