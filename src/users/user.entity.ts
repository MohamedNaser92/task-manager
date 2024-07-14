import { Category } from 'src/categories/category.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('Removed user with id', this.id);
  }
  @AfterUpdate()
  logUpdated() {
    console.log('Updated user with id', this.id);
  }
}
