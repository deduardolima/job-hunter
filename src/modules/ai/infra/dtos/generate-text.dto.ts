import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenerateTextDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12000)
  prompt: string;
}
