import { Injectable } from '@nestjs/common';
import {
  EC2Client,
  DescribeInstancesCommand,
  Reservation,
  Instance,
} from '@aws-sdk/client-ec2';
import { EditServerDTO } from '../dto/edit-server.dto';

@Injectable()
export class EditService {
  async invoke(client: EC2Client): Promise<any> {
    const command = new DescribeInstancesCommand({
      Filters: [
        {
          Name: 'instance-state-name',
          Values: ['pending', 'running', 'stopping', 'stopped'],
        },
      ],
    });
    const response = await client.send(command);
    // インスタンス一覧の取得
    const instances: Instance[] = response.Reservations.flatMap(
      (reservation: Reservation) => {
        return reservation.Instances;
      },
    );

    const result = instances.map((instance: Instance) => {
      return {
        Name: instance.Tags[0].Value,
        InstanceId: instance.InstanceId,
        Status: instance.State.Name,
        InstanceType: instance.InstanceType,
      };
    });

    return result;
  }

  /**
  async invoke(client: EC2Client, editServerDTO: EditServerDTO) {
    const { instanceId, name } = editServerDTO;

    const describeInstancesCommand = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    });
    const response = await client.send(describeInstancesCommand);
    const currentTags = response.Reservations[0].Instances[0].Tags;

    const updatedTags = [
      {
        Key: 'Name',
        Value: name,
      },
    ];

    const mergedTags = [...currentTags, ...updatedTags];

    const createTagsCommand = new CreateTagsCommand({
      Resources: [instanceId],
      Tags: mergedTags,
    });
    await client.send(createTagsCommand);
  }
*/
}
