import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsumptionReport, Vehicle} from "../../interfaces";
import {ConsumptionReportService} from "../../services/consumption-report.service";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
 import {CommonModule, NgIf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {VehicleService} from "../../services/vehicle-service";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {map, Observable, startWith} from "rxjs";
import _default from "../../../../assets/vendor/chart.js/plugins/plugin.tooltip";
import enabled = _default.defaults.enabled;

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
    MatAutocompleteTrigger
  ],
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

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private dialogRef: MatDialogRef<ConsumptionReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ConsumptionReport,
    private reportService: ConsumptionReportService
  ) {
    this.form = this.fb.group({
      id: [data ? data.id : null],
      vehicleId: [data ? data.vehicleId : '', Validators.required],
      startKm: [data ? data.startKm : 0, Validators.required],
      endKm: [data ? data.endKm : 0, Validators.required],
      totalKm: [{value:0,disabled:true}],
      fuelType: [data ? data.fuelType : '', Validators.required],
      fuelQuantityGallons: [data ? data.fuelQuantityGallons : 0, Validators.required],
      pricePerGallon: [data ? data.pricePerGallon : 0, Validators.required],
      totalFuelCost: [{ value: 0, disabled: true }], // Auto-calculated
      consumptionPer100Km: [data ? data.consumptionPer100Km : 0],
      rentalCost: [data ? data.rentalCost : 0],
      maintenanceCost: [data ? data.maintenanceCost : 0],
      repairCost: [data ? data.repairCost : 0],
      insuranceCost: [data ? data.insuranceCost : 0],
      totalCost: [{ value: 0, disabled: true }],
      costPerKm: [{ value: 0, disabled: true }],
      currency: [data ? data.currency : '', Validators.required],
      estimatedCostHTG: [data ? data.estimatedCostHTG : 0],
      estimatedCostUSD: [data ? data.estimatedCostUSD : 0],
      reportDate: [data ? data.reportDate : '', Validators.required]
    });
    this.setupAutoCalculations();

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
      const report = this.form.value;
      if (report.id) {
        this.reportService.updateReport(report.id, report).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.reportService.createReport(report).subscribe(() => {
          this.dialogRef.close(true);
        });
      }

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




  setupAutoCalculations() {
    // Calculate totalKm
    this.form.get('endKm')?.valueChanges.subscribe(() => {
      const startKm = this.form.get('startKm')?.value || 0;
      const endKm = this.form.get('endKm')?.value || 0;
      const totalKm = Math.max(endKm - startKm, 0);
      this.form.get('totalKm')?.setValue(totalKm, { emitEvent: false });
      this.calculateCostPerKm();
    });

    this.form.get('startKm')?.valueChanges.subscribe(() => {
      const startKm = this.form.get('startKm')?.value || 0;
      const endKm = this.form.get('endKm')?.value || 0;
      const totalKm = Math.max(endKm - startKm, 0);
      this.form.get('totalKm')?.setValue(totalKm, { emitEvent: false });
      this.calculateCostPerKm();
    });

    // Calculate totalFuelCost
    this.form.get('fuelQuantityGallons')?.valueChanges.subscribe(() => this.calculateTotalFuelCost());
    this.form.get('pricePerGallon')?.valueChanges.subscribe(() => this.calculateTotalFuelCost());

    // Calculate totalCost
    this.form.valueChanges.subscribe(() => this.calculateTotalCost());
  }

  calculateTotalFuelCost() {
    const fuelQuantityGallons = this.form.get('fuelQuantityGallons')?.value || 0;
    const pricePerGallon = this.form.get('pricePerGallon')?.value || 0;
    const totalFuelCost = fuelQuantityGallons * pricePerGallon;
    this.form.get('totalFuelCost')?.setValue(totalFuelCost, { emitEvent: false });
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    const rentalCost = this.form.get('rentalCost')?.value || 0;
    const maintenanceCost = this.form.get('maintenanceCost')?.value || 0;
    const repairCost = this.form.get('repairCost')?.value || 0;
    const insuranceCost = this.form.get('insuranceCost')?.value || 0;
    const totalFuelCost = this.form.get('totalFuelCost')?.value || 0;

    const totalCost = rentalCost + maintenanceCost + repairCost + insuranceCost + totalFuelCost;
    this.form.get('totalCost')?.setValue(totalCost, { emitEvent: false });

    this.calculateCostPerKm();
  }

  calculateCostPerKm() {
    const totalCost = this.form.get('totalCost')?.value || 0;
    const totalKm = this.form.get('totalKm')?.value || 1; // Prevent division by zero
    const costPerKm = totalKm > 0 ? totalCost / totalKm : 0;
    this.form.get('costPerKm')?.setValue(costPerKm, { emitEvent: false });
  }
  }
