import { Inject, Injectable } from '@nestjs/common';
import { Store } from '../entity/store.entity';
import { StoreRepositoryInterface } from '../interface/store.repository.interface';
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class StoreService {
  constructor(
    @Inject('StoreRepositoryInterface')
    private readonly storeRepository: StoreRepositoryInterface,
  ) {}

  public async create(storeDto: any): Promise<Store> {
    return await this.storeRepository.create(storeDto);
  }

  public async findAll(): Promise<Store[]> {
    return await this.storeRepository.findAll();
  }

  public async getById(id: number): Promise<Store> {
    return await this.storeRepository.findOneById(id);
  }

  public async update(id: number, updateData: any): Promise<UpdateResult> {
    return await this.storeRepository.update(id, updateData);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return await this.storeRepository.remove(id);
  }
}
