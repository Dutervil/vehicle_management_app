export interface Vehicle {
  id: string;
  zlCode: string;
  site: string;
  owner: string;
  category: string;
  plate: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  firstUseYear: number;
}


export interface ConsumptionReport {
  id: string;
  vehicleId: string;
  startKm: number;
  endKm: number;
  totalKm: number;
  fuelType: string;
  fuelQuantityGallons: number;
  pricePerGallon: number;
  totalFuelCost: number;
  consumptionPer100Km: number;
  rentalCost: number;
  maintenanceCost: number;
  repairCost: number;
  insuranceCost: number;
  totalCost: number;
  costPerKm: number;
  currency: string;
  estimatedCostHTG: number;
  estimatedCostUSD: number;
  createdAt: Date;
  reportDate:string
}
