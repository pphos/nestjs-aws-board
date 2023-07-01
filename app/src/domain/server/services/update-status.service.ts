import { Injectable } from '@nestjs/common';
import {
  EC2Client,
  StartInstancesCommandInput,
  StartInstancesCommand,
  StopInstancesCommandInput,
  StopInstancesCommand,
} from '@aws-sdk/client-ec2';
import { UpdateStatusServerDTO } from '../dto/update-status-server.dto';

@Injectable()
export class UpdateStatusService {
  async invoke(
    client: EC2Client,
    updateStatusServerDTO: UpdateStatusServerDTO,
  ) {
    const { instanceId, status } = updateStatusServerDTO;
    if (status === 'running') {
      await this.stopInstances(client, instanceId);
    } else {
      await this.startInstances(client, instanceId);
    }
  }

  private async startInstances(client: EC2Client, instanceId: string) {
    const commandInput: StartInstancesCommandInput = {
      InstanceIds: [instanceId],
    };
    const command = new StartInstancesCommand(commandInput);
    await client.send(command);
  }

  private async stopInstances(client: EC2Client, instanceId: string) {
    const commandInput: StopInstancesCommandInput = {
      InstanceIds: [instanceId],
    };
    const command = new StopInstancesCommand(commandInput);
    await client.send(command);
  }
}
