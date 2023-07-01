import { Injectable } from '@nestjs/common';
import {
  EC2Client,
  RunInstancesCommand,
  RunInstancesCommandInput,
} from '@aws-sdk/client-ec2';
import { ConfigService } from '@nestjs/config';
import { StoreServerDTO } from '../dto/store-server.dto';

interface EnvironmentVariables {
  AWS_EC2_IMAGE_ID: string;
  AWS_EC2_KEY_NAME: string;
  AWS_EC2_SECURITY_GROUP_ID: string;
  AWS_EC2_SUBNET_ID: string;
  AWS_EC2_IAM_INSTANCE_PROFILE_ARN: string;
}

@Injectable()
export class StoreService {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  async invoke(
    client: EC2Client,
    storeServerDTO: StoreServerDTO,
  ): Promise<any> {
    const commandInput: RunInstancesCommandInput = {
      ImageId: this.configService.get('AWS_EC2_IMAGE_ID'),
      InstanceType: storeServerDTO.instanceType,
      MinCount: 1,
      MaxCount: 1,
      KeyName: this.configService.get('AWS_EC2_KEY_NAME'),
      SecurityGroupIds: [this.configService.get('AWS_EC2_SECURITY_GROUP_ID')],
      SubnetId: this.configService.get('AWS_EC2_SUBNET_ID'),
      BlockDeviceMappings: [
        {
          DeviceName: '/dev/sda1',
          Ebs: {
            VolumeSize: storeServerDTO.volumeSize,
          },
        },
      ],
      IamInstanceProfile: {
        Arn: this.configService.get('AWS_EC2_IAM_INSTANCE_PROFILE_ARN'),
      },
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {
              Key: 'Name',
              Value: storeServerDTO.name,
            },
          ],
        },
      ],
    };
    const command = new RunInstancesCommand(commandInput);
    await client.send(command);
  }
}
