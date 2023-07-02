import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  Res,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { EC2Client } from '@aws-sdk/client-ec2';

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
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

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
      throw error;
    }
  }

  @Get('create')
  async create(@Res() res: Response) {
    return res.render('server/create');
  }

  @Post()
  async store(@Res() res: Response, @Body() storeServerDTO: StoreServerDTO) {
    try {
      const errors = await validate(
        plainToClass(StoreServerDTO, storeServerDTO),
      );
      if (errors.length > 0) {
        console.error(errors);
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints),
        );
        console.log(messages);
        // 選択リストの表示の初期入力値は少しめんどくさい
        return res.render('server/create', { storeServerDTO });
      }
      //await this.storeService.invoke(this.ec2Client, storeServerDTO);
      return res.redirect('/server');
    } catch (error) {
      console.error(error);
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}
