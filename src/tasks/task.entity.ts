import { Category } from 'src/categories/category.entity';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskType } from './dtos/task-type.enum.ts';

@Entity()
@Check(
  `(type IN ('text', 'list')) AND
   ((type = 'text' AND textContent IS NOT NULL AND listContent IS NULL) OR
    (type = 'list' AND textContent IS NULL AND listContent IS NOT NULL))`,
)
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  type: TaskType;

  @Column({ nullable: true })
  textContent: string;

  @Column('simple-array', { nullable: true })
  listContent: string[];

  @Column({ default: true })
  isShared: boolean;

  @ManyToOne(() => Category, (category) => category.tasks)
  category: Category;
}
