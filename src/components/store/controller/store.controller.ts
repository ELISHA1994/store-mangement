import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { DistanceService } from '../service/distance.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import JwtAuthenticationGuard from '../../auth/guard/jwt-authentication.guard';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly distanceService: DistanceService,
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async getAllStores() {
    return await this.storeService.findAll();
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async getStore(@Param() id) {
    return await this.storeService.getById(Number(id));
  }

  @Post('add')
  @HttpCode(201)
  @UseGuards(JwtAuthenticationGuard)
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    return await this.storeService.create(createStoreDto);
  }

  @Put('update/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async updateStore(
    @Param('id') id,
    @Body() updateStoreDto: UpdateStoreDto,
    @Res() response,
  ) {
    await this.storeService.update(Number(id), updateStoreDto);

    return response.send('Store updated successfully');
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async deleteStore(@Param('id') id) {
    return await this.storeService.remove(Number(id));
  }

  @Post('distance')
  @UseGuards(JwtAuthenticationGuard)
  async calculateDistance(
    @Body('startLatitude') startLatitude: number,
    @Body('startLongitude') startLongitude: number,
    @Body('endLatitude') endLatitude: number,
    @Body('endLongitude') endLongitude: number,
  ) {
    return await this.distanceService.calculateDistance(
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
    );
  }
}
