import { Expose, Transform } from 'class-transformer';

export class TaskDto {
  @Expose()
  id: number;

  @Expose()
  type: string;

  @Expose()
  isShared: boolean;

  @Expose()
  textContent?: string;

  @Expose()
  listContent?: string[];

  @Transform(({ obj }) => obj.category?.id)
  @Expose()
  categId: number;

  @Transform(({ obj }) => obj.category?.name)
  @Expose()
  categName: string;

  @Transform(({ obj }) => obj.category?.user?.id)
  @Expose()
  userId: number;

  @Transform(({ obj }) => obj.category?.user?.name)
  @Expose()
  userName: string;
}
