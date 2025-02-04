import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsumptionReport, Vehicle} from "../../interfaces";
import {ConsumptionReportService} from "../../services/consumption-report.service";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
 import {CommonModule, NgIf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {VehicleService} from "../../services/vehicle-service";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {map, Observable, startWith} from "rxjs";
import _default from "../../../../assets/vendor/chart.js/plugins/plugin.tooltip";

import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {parseFormattedNumber, setupAutoCalculations, TAUX} from "../../utils";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-consumption-report-form',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatFormFieldModule,

    MatDatepickerModule, MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[provideNativeDateAdapter()],
  templateUrl: './consumption-report-form.component.html',
  styleUrl: './consumption-report-form.component.css'
})
export class ConsumptionReportFormComponent  implements OnInit{

  vehicle :Vehicle[]= [];
  rowConfig: number = 1;
  form: FormGroup;
  vehicleControl = new FormControl('');
  filteredVehicles!: Observable<Vehicle[]>;
  title="Enregistrer un nouveau Rapport"
   isShow=false;
  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private  toastService:ToastrService,
    private dialogRef: MatDialogRef<ConsumptionReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ConsumptionReport,
    private reportService: ConsumptionReportService
  ) {
    this.form = this.fb.group({

      vehicleId: [data ? data.vehicleId : '', Validators.required],
      startKm: [data ? data.startKm : 0, Validators.required],
      endKm: [data ? data.endKm : 0, Validators.required],
      totalKm: [{value:0,disabled:true},data ? data.totalKm :0],
      fuelType: [data ? data.fuelType : '', Validators.required],
      fuelQuantityGallons: [data ? data.fuelQuantityGallons : 0, Validators.required],
      pricePerGallon: [data ? data.pricePerGallon : 0, Validators.required],
      totalFuelCost: [{ value: 0, disabled: true },data ? data.totalFuelCost :0], // Auto-calculated
      consumptionPer100Km: [{ value: 0, disabled: true },data ? data.consumptionPer100Km : 0],
      rentalCost: [data ? data.rentalCost : 0],
      maintenanceCost: [data ? data.maintenanceCost : 0],
      repairCost: [data ? data.repairCost : 0],
      insuranceCost: [data ? data.insuranceCost : 0],
      totalCost: [{ value: 0, disabled: true },data ? data.totalCost : 0],
      costPerKm: [{ value: 0, disabled: true },data ?  data.costPerKm: 0],
      currency: [data ? data.currency : '', Validators.required],
      estimatedCostHTG: [{ value: 0, disabled: true },data ? data.estimatedCostHTG : 0],
      estimatedCostUSD: [{ value: 0, disabled: true },data ? data.estimatedCostUSD : 0],
      reportDate: [data ? data.reportDate : '', Validators.required]
    });
   setupAutoCalculations(this.form);

  }

  ngOnInit(): void {
    this.loadVehicles();
    this.filteredVehicles = this.vehicleControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterVehicles(value || ''))
    );
  }

  onSubmit(): void {
    if (this.form.valid) {

      const formData = {
        ...this.form.value,
        totalKm: this.form.get('totalKm')?.value,
        totalFuelCost: parseFormattedNumber(this.form.get('totalFuelCost')?.value),
        consumptionPer100Km:this.form.get('consumptionPer100Km')?.value,
        totalCost: parseFormattedNumber(this.form.get('totalCost')?.value),
        costPerKm: parseFormattedNumber(this.form.get('costPerKm')?.value),
        estimatedCostHTG: parseFormattedNumber(this.form.get('estimatedCostHTG')?.value),
        estimatedCostUSD: parseFormattedNumber(this.form.get('estimatedCostHTG')?.value / TAUX),  // Fixed typo here
      };
        this.reportService.createReport(formData).subscribe({
          next:(response)=>{
            this.toastService.success(response.message)
            this.dialogRef.close();
          },
          error:(error)=>{
            const errorMessage = error?.error?.message || 'An unexpected error occurred';
            this.toastService.success(errorMessage)
          }
        });


    }
  }
    onCancel(): void {
      this.dialogRef.close();
    }

  randomizeRowConfig(): void {
    this.rowConfig = Math.floor(Math.random() * 3) + 1;
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (response) => {
        this.vehicle=response.data;
      }
    });
  }

  filterVehicles(value: string): Vehicle[] {
    const filterValue = value;
    return this.vehicle.filter(vehicle =>
      vehicle.plate.toLowerCase().includes(filterValue) ||
      vehicle.model.toLowerCase().includes(filterValue) ||
      vehicle.brand.toLowerCase().includes(filterValue)
    );
  }

  selectVehicle(vehicle: Vehicle): void {
    this.form.get('vehicleId')?.setValue(vehicle.id);
    this.vehicleControl.setValue(vehicle.plate+ " - " + vehicle.model+ " - "+vehicle.brand+" - "+vehicle.zlCode +" - "+vehicle.category);
  }


}
