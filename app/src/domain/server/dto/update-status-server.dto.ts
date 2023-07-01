import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusServerDTO {
  @IsNotEmpty()
  @IsString()
  instanceId: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
