import { Injectable } from '@nestjs/common';
import * as geolib from 'geolib';

@Injectable()
export class DistanceService {
  async calculateDistance(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
  ) {
    const start = { latitude: startLatitude, longitude: startLongitude };
    const end = { latitude: endLatitude, longitude: endLongitude };
    return geolib.getDistance(start, end);
  }
}
