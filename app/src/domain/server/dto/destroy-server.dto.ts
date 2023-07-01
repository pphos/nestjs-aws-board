import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class DestroyServerDTO {
  @IsNotEmpty()
  @IsString()
  instanceId: string;
}
