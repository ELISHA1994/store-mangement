import { BaseInterfaceRepository } from './base.interface.repository';
import { DeleteResult, Repository, UpdateResult, FindOptionsWhere } from 'typeorm';

export abstract class BaseAbstractRepository<T>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }
  public async create(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async update(id: any, data): Promise<UpdateResult> {
    return await this.entity.update(id, data);
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async findByCondition(filterCondition: any): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findOneById(id: any): Promise<T> {
    return await this.entity.findOneBy({ id: id } as FindOptionsWhere<T>);
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return await this.entity.delete(id);
  }
}
