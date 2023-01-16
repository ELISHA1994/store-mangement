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
    const distance = geolib.getDistance(start, end);

    return `${distance * 0.000621371} miles`;
  }
}
