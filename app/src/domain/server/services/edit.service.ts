import { Injectable } from '@nestjs/common';
import {
  EC2Client,
  DescribeInstancesCommand,
  CreateTagsCommand,
} from '@aws-sdk/client-ec2';
import { EditServerDTO } from '../dto/edit-server.dto';

@Injectable()
export class EditService {
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
}
