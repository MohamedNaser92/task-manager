import { Expose, Transform } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;
  @Expose()
  name: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
  @Transform(({ obj }) => obj.user.name)
  @Expose()
  userName: string;
}
