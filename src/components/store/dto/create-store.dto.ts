import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  city: string;

  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  long: number;
}
// 12.028644503164497, 8.513066868922131
