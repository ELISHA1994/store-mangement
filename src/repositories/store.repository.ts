import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../components/store/entity/store.entity';
import { StoreRepositoryInterface } from '../components/store/interface/store.repository.interface';

@Injectable()
export class StoreRepository
  extends BaseAbstractRepository<Store>
  implements StoreRepositoryInterface
{
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
  ) {
    super(storesRepository);
  }
}
