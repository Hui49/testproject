import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Resume } from '../resume.interface';

export class UpdateApplicationDto implements Partial<Resume> {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  // Add other fields from the Resume interface as needed
}