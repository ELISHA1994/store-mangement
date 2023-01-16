import { IsNotEmpty, IsNumber } from 'class-validator';

export class CalDistanceDto {
  @IsNotEmpty()
  @IsNumber()
  startLatitude: number;

  @IsNotEmpty()
  @IsNumber()
  startLongitude: number;

  @IsNotEmpty()
  @IsNumber()
  endLatitude: number;

  @IsNotEmpty()
  @IsNumber()
  endLongitude: number;
}
