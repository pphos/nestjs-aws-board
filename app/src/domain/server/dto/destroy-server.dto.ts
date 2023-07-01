import { IsNotEmpty, IsString } from 'class-validator';

export class DestroyServerDTO {
  @IsNotEmpty()
  @IsString()
  instanceId: string;
}
