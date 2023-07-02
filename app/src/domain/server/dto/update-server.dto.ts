import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateServerDTO {
  @IsNotEmpty()
  @IsString()
  instanceType: string;
}

export class UpdateServerQueryDTO {
  @IsNotEmpty()
  @IsString()
  instanceId: string;
}
