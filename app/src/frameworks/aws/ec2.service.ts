import { Injectable } from '@nestjs/common';
import { EC2Client, DescribeInstancesCommand } from '@aws-sdk/client-ec2';

@Injectable()
export class Ec2Service {
  private readonly ec2: EC2Client;

  constructor() {
    this.ec2 = new EC2Client({});
  }

  async describeInstances() {
    const command = new DescribeInstancesCommand({});
    try {
      const response = this.ec2.send(command);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
