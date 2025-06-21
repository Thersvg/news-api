import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryDTO } from './dtos/category.dto';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: CategoryDTO) {
    return await this.categoryService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: CategoryDTO) {
    return await this.categoryService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.categoryService.remove(Number(id));
  }

  @Get()
  async categorys() {
    return await this.categoryService.categories();
  }

  @Get(':slug')
  async getPostsByCategory(@Param('slug') slug: string) {
    return await this.categoryService.getPostsByCategory(slug);
  }
}
