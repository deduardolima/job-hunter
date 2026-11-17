import { IsBoolean, IsIn, IsOptional, IsUUID } from 'class-validator';

export class ExportQueryDto {
  @IsIn(['pdf', 'docx']) format: 'pdf' | 'docx';
}

export class LinkApplicationDto {
  @IsUUID() applicationId: string;
  @IsOptional() @IsBoolean() allowUnreviewed?: boolean;
}
