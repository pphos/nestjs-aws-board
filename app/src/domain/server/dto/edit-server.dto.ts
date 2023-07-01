import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class EditServerDTO {
  @IsNotEmpty()
  @IsString()
  instanceId: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
