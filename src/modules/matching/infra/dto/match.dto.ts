import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateMatchDto {
  @IsUUID() profileId: string;
  @IsOptional() @IsBoolean() force?: boolean;
}

export class BatchMatchDto {
  @IsUUID() profileId: string;
  @IsOptional() @IsArray() @IsUUID('all', { each: true }) jobIds?: string[];
  @IsOptional() @IsBoolean() force?: boolean;
}
