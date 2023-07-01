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
    const command = new DescribeInstancesCommand({});
    const response = await client.send(command);
    // インスタンス一覧の取得
    const instances = response.Reservations?.map((reservation: Reservation) => {
      return reservation.Instances;
    })[0];

    const result = instances.map((instance: Instance) => {
      return {
        InstanceId: instance.InstanceId,
        IamInstanceProfile: instance.IamInstanceProfile.Arn,
        ImageId: instance.ImageId,
        InstanceType: instance.InstanceType,
        PrivateIpAddress: instance.PrivateIpAddress,
      };
    });

    return result;
  }
}
