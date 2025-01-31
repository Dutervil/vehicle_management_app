import {Component, OnInit} from '@angular/core';

import {VehicleService} from "../../services/vehicle-service";
import {Vehicle} from "../../interfaces";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {VehicleCreateComponent} from "../vehicle-create/vehicle-create.component";


@Component({
    selector: 'app-vehicle-list',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,],
    templateUrl: './vehicle-list.component.html',
    styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {

  vehicles: Vehicle[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['zlCode', 'site', 'owner', 'category', 'plate', 'brand', 'model','year','firstUseYear','actions']; // Your columns

  filteredVehicles = new MatTableDataSource<any>([]);
  pageSize = 5;

  constructor(private vehicleService: VehicleService, private  router:Router,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe(
      {
        next: (response) => {

            this.vehicles=response.data;
          this.filteredVehicles.data = this.vehicles;
          this.isLoading = false;
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'An unexpected error occurred';
          console.error('Login failed', errorMessage);
          this.isLoading = false;
        },
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredVehicles.filter = filterValue.trim().toLowerCase();
  }

  onPageChanged(event: any): void {
    // Calculate the start and end index based on the page size and page index
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    // Slice the vehicles array to show only the data for the current page
    this.filteredVehicles.data = this.vehicles.slice(startIndex, endIndex);
  }
  addNewVehicle() {

    const dialogRef = this.dialog.open(VehicleCreateComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form submitted successfully');
      }
    });
    // this.router.navigate(['admin/vehicle/add'])

  }


  viewVehicle(vehicle:Vehicle) {

  }
  editVehicle(vehicle:Vehicle) {

  }
  deleteVehicle(vehicle:Vehicle) {

  }
}
