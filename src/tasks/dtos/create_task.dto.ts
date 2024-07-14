import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { TaskType } from './task-type.enum.ts';

export class CreatTaskDto {
  @IsEnum(TaskType)
  type: TaskType;

  @ValidateIf((o) => o.type === TaskType.TEXT)
  @IsOptional()
  @IsString()
  textContent?: string;

  @ValidateIf((o) => o.type === TaskType.LIST)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listContent?: string[];

  @IsBoolean()
  isShared: boolean;
}
