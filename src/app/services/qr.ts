import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  constructor() { }

  getVehicleData() {
    const params = new URLSearchParams(window.location.search);
    return {
      vehicleId: params.get('vehicleId') || params.get('v') || '',
      fuelType: params.get('fuelType') || params.get('f') || ''
    };
  }
}
