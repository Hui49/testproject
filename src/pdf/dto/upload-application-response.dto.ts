import { IsString, IsNotEmpty } from 'class-validator';
import { ApplicationState, Resume } from '../resume.interface';

export class UploadApplicationResponseDto{
  message: String
  application_content: Resume
}