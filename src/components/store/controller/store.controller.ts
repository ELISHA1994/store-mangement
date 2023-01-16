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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Store } from '../entity/store.entity';
import { CalDistanceDto } from '../dto/cal-distance.dto';

@Controller('store')
@ApiTags('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly distanceService: DistanceService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all store',
    description: 'List all store',
  })
  @UseGuards(JwtAuthenticationGuard)
  async getAllStores() {
    return await this.storeService.findAll();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a store',
    description: 'Get a store details from database',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a store that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A store has been successfully fetched',
    type: Store,
  })
  @ApiResponse({
    status: 404,
    description: 'A store with given id does not exist.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async getStore(@Param() id) {
    return await this.storeService.getById(Number(id));
  }

  @Post('add')
  @HttpCode(201)
  @ApiBody({ type: CreateStoreDto })
  @ApiOperation({
    summary: 'Add a new store',
    description: 'Create a new store',
  })
  @UseGuards(JwtAuthenticationGuard)
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    return await this.storeService.create(createStoreDto);
  }

  @Put('update/:id')
  @HttpCode(200)
  @ApiBody({ type: UpdateStoreDto })
  @ApiOperation({
    summary: 'Update a store',
    description: 'Update a store',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a store that exists in the database',
    type: Number,
  })
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
  @ApiOperation({
    summary: 'Delete a store',
    description: 'Create a new store',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a store that exists in the database',
    type: Number,
  })
  @UseGuards(JwtAuthenticationGuard)
  async deleteStore(@Param('id') id) {
    return await this.storeService.remove(Number(id));
  }

  @Post('distance')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({ type: CalDistanceDto })
  @ApiOperation({
    summary: 'Calculate Distance',
    description: 'Calculate distance between stores',
  })
  async calculateDistance(@Body() calDistanceDto: CalDistanceDto) {
    return await this.distanceService.calculateDistance(
      calDistanceDto.startLatitude,
      calDistanceDto.startLongitude,
      calDistanceDto.endLatitude,
      calDistanceDto.endLongitude,
    );
  }
}
