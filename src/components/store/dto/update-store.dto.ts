import { IsNumber, IsOptional, MinLength } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @MinLength(3)
  city?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  long: number;
}
