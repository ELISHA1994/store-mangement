import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Geometry, Point } from 'geojson';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', name: 's_city' })
  city: string;

  @Column({ type: 'double precision', name: 'd_lat' })
  lat: number;

  @Column({ type: 'double precision', name: 'd_long' })
  long: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
