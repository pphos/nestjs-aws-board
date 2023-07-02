import { Injectable } from '@nestjs/common';
import {
  EC2Client,
  ModifyInstanceAttributeCommand,
  ModifyInstanceAttributeCommandInput,
} from '@aws-sdk/client-ec2';
import { UpdateServerDTO } from '../dto/update-server.dto';

@Injectable()
export class UpdateService {
  async invoke(
    client: EC2Client,
    instanceId: string,
    updateServerDTO: UpdateServerDTO,
  ) {
    const commandInput: ModifyInstanceAttributeCommandInput = {
      InstanceId: instanceId,
      InstanceType: {
        Value: updateServerDTO.instanceType,
      },
    };
    const command = new ModifyInstanceAttributeCommand(commandInput);
    await client.send(command);
  }
}
