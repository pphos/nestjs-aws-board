import { Injectable } from '@nestjs/common';
import {
  EC2Client,
  TerminateInstancesCommand,
  TerminateInstancesCommandInput,
} from '@aws-sdk/client-ec2';
import { DestroyServerDTO } from '../dto/destroy-server.dto';

@Injectable()
export class DestroyService {
  async invoke(
    client: EC2Client,
    destroyServerDTO: DestroyServerDTO,
  ): Promise<any> {
    const { instanceId } = destroyServerDTO;
    const commandInput: TerminateInstancesCommandInput = {
      InstanceIds: [instanceId],
    };
    const command = new TerminateInstancesCommand(commandInput);
    const response = await client.send(command);
    return response;
  }
}
