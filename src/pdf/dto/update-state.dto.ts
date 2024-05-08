import { IsString, IsNotEmpty } from 'class-validator';
import { ApplicationState } from '../resume.interface';

export class UpdateStateDto {
  @IsString()
  @IsNotEmpty()
  state: ApplicationState;
}