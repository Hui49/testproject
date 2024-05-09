import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Application } from '../interface/application.interface';

export class UpdateApplicationDto implements Partial<Application> {
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