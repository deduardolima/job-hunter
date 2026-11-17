import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateTailorDto {
  @IsUUID() profileId: string;
  @IsOptional() @IsBoolean() force?: boolean;
}
