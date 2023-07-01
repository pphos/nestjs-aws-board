import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class StoreServerDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  instanceType: string;

  @IsNotEmpty()
  @IsNumberString()
  volumeSize: number;

  @IsNotEmpty()
  @IsString()
  iamInstanceProfileName: string;
}
