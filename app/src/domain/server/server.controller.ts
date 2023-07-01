import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { EC2Client } from '@aws-sdk/client-ec2';

import { IndexService } from './services/index.service';
import { StoreService } from './services/store.service';
import { DestroyService } from './services/destroy.service';
import { EditService } from './services/edit.service';
import { StoreServerDTO } from './dto/store-server.dto';
import { EditServerDTO } from './dto/edit-server.dto';
import { DestroyServerDTO } from './dto/destroy-server.dto';

@Controller('server')
export class ServerController {
  private readonly ec2Client;

  constructor(
    private readonly indexService: IndexService,
    private readonly storeService: StoreService,
    private readonly destroyService: DestroyService,
    private readonly editService: EditService,
  ) {
    this.ec2Client = new EC2Client({});
  }

  @Get()
  async index() {
    try {
      const response = await this.indexService.invoke(this.ec2Client);
      return response;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  async store(@Body() storeServerDTO: StoreServerDTO) {
    try {
      await this.storeService.invoke(this.ec2Client, storeServerDTO);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  async destroy(@Body() destroyServerDTO: DestroyServerDTO) {
    try {
      await this.destroyService.invoke(this.ec2Client, destroyServerDTO);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Put('/edit')
  async edit(@Body() editServerDTO: EditServerDTO) {
    try {
      await this.editService.invoke(this.ec2Client, editServerDTO);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
