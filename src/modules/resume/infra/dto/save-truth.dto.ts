import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SaveTruthDto {
  @IsString() @MinLength(50) @MaxLength(100_000)
  truthMarkdown: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  exclusions?: string[];
}
