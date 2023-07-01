import { IsNotEmpty, IsString } from 'class-validator';

export class EditServerDTO {
  @IsNotEmpty()
  @IsString()
  instanceId: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
