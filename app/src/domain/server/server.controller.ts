import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  Res,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  EC2Client,
  DescribeInstancesCommand,
  DescribeInstancesCommandInput,
  Instance,
  Reservation
} from '@aws-sdk/client-ec2';

import { IndexService } from './services/index.service';
import { StoreService } from './services/store.service';
import { DestroyService } from './services/destroy.service';
import { UpdateStatusService } from './services/update-status.service';
import { EditService } from './services/edit.service';
import { StoreServerDTO } from './dto/store-server.dto';
import { UpdateServerDTO, UpdateServerQueryDTO } from './dto/update-server.dto';
import { DestroyServerDTO } from './dto/destroy-server.dto';
import { UpdateStatusServerDTO } from './dto/update-status-server.dto';
import { UpdateService } from './services/update.service';

@Controller('server')
export class ServerController {
  private readonly ec2Client;

  constructor(
    private readonly indexService: IndexService,
    private readonly storeService: StoreService,
    private readonly destroyService: DestroyService,
    private readonly editService: EditService,
    private readonly updateService: UpdateService,
    private readonly updateStatusService: UpdateStatusService,
  ) {
    this.ec2Client = new EC2Client({});
  }

  @Get()
  async index(@Res() res: Response) {
    try {
      const response = await this.indexService.invoke(this.ec2Client);
      const instances = response.map((instance) => {
        const status = instance.Status;
        const controlText = status === 'running' ? '停止' : '起動';

        return {
          name: instance.Name,
          instanceId: instance.InstanceId,
          status: instance.Status,
          instanceType: instance.InstanceType,
          ipAddress: instance.PrivateIpAddress,
          controlText: controlText,
        };
      });

      return res.render('server/index', { instances: instances });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('create')
  async create(@Res() res: Response) {
    return res.render('server/create');
  }

  @Post()
  async store(@Res() res: Response, @Body() storeServerDTO: StoreServerDTO) {
    try {
      await this.storeService.invoke(this.ec2Client, storeServerDTO);
      return res.redirect('/server');
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('_updateStatus')
  async updateStatus(
    @Res() res: Response,
    @Body() updateStatusServerDTO: UpdateStatusServerDTO,
  ) {
    try {
      await this.updateStatusService.invoke(
        this.ec2Client,
        updateStatusServerDTO,
      );
      return res.redirect('/server');
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('/_destroy')
  async destroy(
    @Res() res: Response,
    @Body() destroyServerDTO: DestroyServerDTO,
  ) {
    try {
      await this.destroyService.invoke(this.ec2Client, destroyServerDTO);
      return res.redirect('/server');
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('/edit')
  async edit(@Res() res: Response) {
    try {
      const response = await this.editService.invoke(this.ec2Client);
      const instances = response.map((instance) => {
        return {
          name: instance.Name,
          instanceId: instance.InstanceId,
          status: instance.Status,
          instanceType: instance.InstanceType,
        };
      });

      return res.render('server/edit', { instances: instances });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('/:instanceId')
  async update(
    @Res() res: Response,
    @Param() queryParams: UpdateServerQueryDTO,
    @Body() updateServerDTO: UpdateServerDTO,
  ) {
    try {
      await this.updateService.invoke(
        this.ec2Client,
        queryParams.instanceId,
        updateServerDTO,
      );
      return res.redirect('/server/edit');
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
