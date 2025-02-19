import {Component, inject, OnDestroy, OnInit} from '@angular/core';

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
import {ToastrService} from "ngx-toastr";
import {ConfirmDialogComponent} from "../../../../components/confirm-dialog/confirm-dialog.component";
import {Subscription} from "rxjs";
import {MatIconModule} from "@angular/material/icon";


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
    MatIconModule,
    MatFormFieldModule,],
    templateUrl: './vehicle-list.component.html',
    styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit,OnDestroy {

  vehicles: Vehicle[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['zlCode', 'site', 'owner', 'category', 'plate', 'brand', 'model','year','firstUseYear','actions']; // Your columns
  subscription = new Subscription();
  filteredVehicles = new MatTableDataSource<any>([]);
  pageSize = 5;
  toastService = inject(ToastrService)
  constructor(private vehicleService: VehicleService, private  router:Router,private dialog: MatDialog) {}


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    let sub =this.vehicleService.getVehicles().subscribe(
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
    this.subscription.add(sub)
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
    this.openpopup("");

  }


  openpopup(id:string){
    const dialogRef = this.dialog.open(VehicleCreateComponent, {
      width: '800px',
      exitAnimationDuration:'1000ms',
      enterAnimationDuration:'1000ms',
      data: {
         id
      }
    })
    dialogRef.afterClosed().subscribe(() => {

        this.loadVehicles();

    });
  }


  editVehicle(vehicle:Vehicle) {
    this.openpopup(vehicle.id)
  }
  deleteVehicle(vehicle:Vehicle) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Êtes-vous sûr de vouloir continuer ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       let sub= this.vehicleService.deleteVehicle(vehicle.id).subscribe(
          {
            next: (response) => {
              this.toastService.success(response.message)
              this.loadVehicles();
            },
            error: (error) => {
              const errorMessage = error?.error?.message || 'An unexpected error occurred';
              console.error('Login failed', errorMessage);
              this.toastService.error(errorMessage)
            },
          }
        );
       this.subscription.add(sub)

      } else {
        console.log('Action annulée');
      }
    });
  }

  viewVehicle(vehicle:Vehicle) {
    this.router.navigate(['admin/vehicle/view', vehicle.id]);
  }
}
