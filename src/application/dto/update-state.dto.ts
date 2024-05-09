import { IsString, IsNotEmpty } from 'class-validator';
import { ApplicationState } from '../interface/application.interface';

export class UpdateStateDto {
  @IsString()
  @IsNotEmpty()
  state: ApplicationState;
}
