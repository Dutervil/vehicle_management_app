import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ConsumptionReport, Vehicle, VehicleReport } from "../../interfaces";
import { VehicleService } from "../../services/vehicle-service";
import { exportToPDF } from "../../utils";
import {FormsModule} from "@angular/forms";
import {DatePipe, DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-vehicle-view',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './vehicle-view.component.html',
  styleUrls: ['./vehicle-view.component.css']
})
export class VehicleViewComponent implements OnInit {
  vehicle: Vehicle = {
    id: '',
    zlCode: '',
    site: '',
    owner: '',
    category: '',
    plate: '',
    type: '',
    brand: '',
    model: '',
    year: 0,
    firstUseYear: 0,
    createdAt:'',
    consumptionReports: [],

  };

  vehicleId!: string;

  filteredReports: VehicleReport[] = [];
  paginatedReports: VehicleReport[] = [];
  dateRange = {
    start: '',
    end: ''
  };

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  startIndex = 0;
  endIndex = 0;

  constructor(private route: ActivatedRoute, private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleId = this.route.snapshot.paramMap.get('id')!;
    this.findVehicleReportById();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredReports.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.filteredReports.length);
    this.paginatedReports = this.filteredReports.slice(this.startIndex, this.endIndex);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  filterReports() {
    const startDate = this.dateRange.start  ;
    const endDate = this.dateRange.end  ;
    const range=convertToISODateRange(startDate,endDate)

  this.vehicleService.getVehicleReports(this.vehicleId,range.startDate,range.endDate).subscribe({
    next: (response) => {
      this.vehicle = response.data;
      this.filteredReports = this.vehicle.consumptionReports;
      console.log(response.data)
      // this.updatePagination();
    },
    error: (err) => {
      console.error('Error fetching vehicle data:', err);
      // You can handle the error here (e.g., show a message to the user)
    }
  })

    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters() {
    this.dateRange = {
      start: '',
      end: ''
    };
    this.filteredReports = this.vehicle.consumptionReports;
    this.currentPage = 1;
    this.updatePagination();
  }

  exportToPDF() {
    exportToPDF(this.vehicle);
  }

  findVehicleReportById() {
    this.vehicleService.getVehicle(this.vehicleId).subscribe({
      next: (response) => {
        this.vehicle = response.data;
console.log(response.data)
        this.filteredReports = this.vehicle.consumptionReports;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching vehicle data:', err);
        // You can handle the error here (e.g., show a message to the user)
      }
    });
  }
}


function convertToISODateRange(startDate: string, endDate: string) {
  // Convert the start and end dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set start date to the beginning of the day (00:00:00.000Z)
  start.setHours(0, 0, 0, 0);  // Set to 00:00:00.000

  // Set end date to the end of the day (23:59:59.999Z)
  end.setHours(23, 59, 59, 999);  // Set to 23:59:59.999

  // Convert both dates to ISO string format
  const startDateISO = start.toISOString();
  const endDateISO = end.toISOString();

  // Return the formatted dates
  return {
    startDate: startDateISO,
    endDate: endDateISO,
  };
}

// Example usage:
const dateRange = convertToISODateRange('2025-02-12', '2025-02-11');
console.log(dateRange);
