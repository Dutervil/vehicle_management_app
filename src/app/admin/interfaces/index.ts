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
  createdAt:string
  consumptionReports:VehicleReport[]
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
  // createdAt: Date;
  createdAt:string
  reportDate:string,
  vehicle:Vehicle
}

export interface VehicleReport {
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
  // createdAt: Date;
  createdAt:string
  reportDate:string,
  rate:Rate

}

export interface StatisticsDto {
  totalGallons: number;
  totalVehicles: number;
  totalInsuranceCost: number;
  totalRepairCost: number;
  totalMaintenanceCost: number;
  totalRentalCost: number;
}


export interface MonthlyStatisticsDto {
  month: string; // Exemple : "2024-01"
  totalGallons: number;
  totalInsuranceCost: number;
  totalRepairCost: number;
  totalMaintenanceCost: number;
  totalRentalCost: number;
}


export interface  Rate{
  id:number;
  rate:number;
  createdAt:string,
  status:string


}


