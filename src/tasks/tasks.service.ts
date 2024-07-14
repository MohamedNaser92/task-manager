import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreatTaskDto } from './dtos/create_task.dto';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  //? Creating Task
  createTask(taskDto: CreatTaskDto, category: Category) {
    const task = this.repo.create({ ...taskDto });
    task.category = category;
    return this.repo.save(task);
  }

  //? Find all tasks (just for get tasks or if there admin)
  findAllTasks() {
    return this.repo.find({ relations: ['category', 'category.user'] });
  }

  //? find one task by id
  async findOneTask(id: number) {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['category', 'category.user'],
    });
    if (!task) {
      throw new NotFoundException('Task not exist');
    }
    return task;
  }

  //? Find All tasks in specific category
  async findTasksByCategory(categId: number) {
    const tasks = await this.repo.find({
      where: { category: { id: categId } },
      relations: ['category', 'category.user'],
    });
    if (!tasks.length) {
      throw new NotFoundException('No tasks for this category');
    }
    return tasks;
  }

  //? Find all tasks with specific user
  findTasksByUser(userId: number) {
    return this.repo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('category.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  //? Update specific task
  async updateTask(id: number, user: User, attrs: Partial<Task>) {
    const task = await this.findOneTask(id);

    if (task.category.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this task',
      );
    }
    Object.assign(task, attrs);
    return this.repo.save(task);
  }

  //? Remove specific task
  async removeTask(id: number, user: User) {
    const task = await this.findOneTask(id);
    if (task.category.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this task',
      );
    }
    return this.repo.remove(task);
  }

  //?Pagination
  async paginate(query, page: number, limit: number) {
    return query.skip((page - 1) * limit).take(limit);
  }

  //? Filtering by category name:

  async filterByCategoryNamefun(query, categName: string) {
    return query.andWhere('category.name = :name', { name: categName });
  }

  //? Filtering by task shared name:

  async filterByTaskSharedfun(query, isShared: boolean) {
    console.log(isShared);
    return query.andWhere('task.isShared = :isShared', { isShared: isShared });
  }

  //? Sorting

  async sortingByfun(query, sortBy: string, order: 'ASC' | 'DESC') {
    if (sortBy === 'category') {
      return query.orderBy('category.name', order);
    } else if (sortBy === 'shared') {
      return query.orderBy('task.isShared', order);
    }
    return query;
  }

  //? Find tasks with specific features
  async findCustomTasks(
    userId: number,
    page: number = 1,
    limit: number = 10,
    filterByCategoryName?: string,
    filterByTaskShared?: boolean,
    sortBy?: string,
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
    let query = this.repo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('category.user', 'user')
      .where('user.id = :userId', { userId });

    if (filterByCategoryName) {
      query = await this.filterByCategoryNamefun(query, filterByCategoryName);
    }

    if (filterByTaskShared !== undefined) {
      query = await this.filterByTaskSharedfun(query, filterByTaskShared);
    }
    if (sortBy) {
      query = await this.sortingByfun(query, sortBy, order);
    }
    query = await this.paginate(query, page, limit);

    const [tasks, total] = await query.getManyAndCount();
    return { tasks, total };
  }
}
