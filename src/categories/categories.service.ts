import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/creat-category.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  createCategory(categoryDto: CreateCategoryDto, user: User) {
    const category = this.repo.create(categoryDto);
    category.user = user;
    return this.repo.save(category);
  }

  async findOneCategory(id: string) {
    const category = await this.repo.findOne({
      where: { id: parseInt(id) },
      relations: ['user'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  findAllCategotiesUser(id: number) {
    return this.repo.find({ where: { user: { id } }, relations: ['user'] });
  }

  findAllCategries() {
    return this.repo.find({ relations: ['user'] });
  }

  async updateCategory(id: string, attrs: Partial<Category>, user: User) {
    const category = await this.findOneCategory(id);

    if (category.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this category',
      );
    }
    Object.assign(category, attrs);
    return this.repo.save(category);
  }

  async removeCategory(id: string, user: User) {
    const category = await this.findOneCategory(id);
    if (category.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this category',
      );
    }
    return this.repo.remove(category);
  }
}
