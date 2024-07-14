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
import { CreateCategoryDto } from './dtos/creat-category.dto';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/guards/auth.gaurds';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CategoryDto } from './dtos/category.dto';

@Controller('categories')
@Serialize(CategoryDto)
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}
  @Post('/create')
  @UseGuards(AuthGuard)
  createCategory(@Body() body: CreateCategoryDto, @CurrentUser() user: User) {
    return this.categoryService.createCategory(body, user);
  }

  @Get('/allcateg')
  findAll() {
    return this.categoryService.findAllCategries();
  }

  @Get('/onecategory/:id')
  findCategory(@Param('id') id: string) {
    return this.categoryService.findOneCategory(id);
  }

  @Get('/allcategories')
  @UseGuards(AuthGuard)
  findAllCategoriesUser(@CurrentUser() user: User) {
    return this.categoryService.findAllCategotiesUser(user.id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateCategory(
    @Param('id') id: string,
    @Body() body: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return this.categoryService.updateCategory(id, body, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteCategory(@Param('id') id: string, @CurrentUser() user: User) {
    return this.categoryService.removeCategory(id, user);
  }
}
