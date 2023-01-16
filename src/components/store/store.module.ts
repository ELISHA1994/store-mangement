import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entity/store.entity';
import { StoreRepository } from '../../repositories/store.repository';
import { StoreRepositoryInterface } from './interface/store.repository.interface';
import { StoreController } from './controller/store.controller';
import { StoreService } from './service/store.service';
import { DistanceService } from './service/distance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [
    StoreService,
    {
      provide: 'StoreRepositoryInterface',
      useClass: StoreRepository,
    },
    DistanceService,
  ],
  controllers: [StoreController],
})
export class StoreModule {}
