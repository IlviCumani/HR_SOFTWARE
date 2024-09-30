import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  Delete,
  Patch,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/createAsset.dto';
import mongoose from 'mongoose';
import { UpdateAssetDto } from './dto/updateAsset.dto';
import { Asset } from './schemas/Asset.schema';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.createAsset(createAssetDto);
  }

  @Get()
  async findAll(): Promise<Asset[]> {
    return this.assetsService.findAll();
  }
  @Get('employee')
  async findAllEmployee(): Promise<Asset[]> {
    return this.assetsService.findAllEmployee();
  }

  @Get(':name')
  async findById(@Param('name') name: string) {
    return this.assetsService.findName(name);
  }

  @Get('user/:userId')
  async findMyAssets(@Param('userId') userId: string) {
    return this.assetsService.findMyAssets(userId);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.assetsService.updateAsset(id, updateAssetDto);
  }

  @Delete(':id')
  async deleteCode(@Param('id') id: string) {
    return this.assetsService.softDeleteAssetById(id);
  }
}
