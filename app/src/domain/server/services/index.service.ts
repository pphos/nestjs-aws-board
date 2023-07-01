import { Injectable } from '@nestjs/common';
import {
  EC2Client,
  DescribeInstancesCommand,
  Reservation,
  Instance,
} from '@aws-sdk/client-ec2';

@Injectable()
export class IndexService {
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
        IamInstanceProfile: instance.IamInstanceProfile?.Arn,
        ImageId: instance.ImageId,
        InstanceType: instance.InstanceType,
        PrivateIpAddress: instance.PrivateIpAddress,
      };
    });

    return result;
  }
}
