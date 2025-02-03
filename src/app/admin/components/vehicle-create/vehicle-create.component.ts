import {Component, Inject, inject, OnInit, Signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {VehicleService} from "../../services/vehicle-service";
import {ToastrService, ToastNoAnimation} from 'ngx-toastr';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Vehicle} from "../../interfaces";


@Component({
  selector: 'app-vehicle-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinner


  ],
  templateUrl: './vehicle-create.component.html',
  styleUrl: './vehicle-create.component.css'
})
export class VehicleCreateComponent implements OnInit {

  isLoading: boolean = false;
  isEdit = false;
  vehicle: Vehicle | undefined;
  vehicleForm: FormGroup;
  vehicleService = inject(VehicleService)
  toastService = inject(ToastrService)
  title = '✅ Veuillez remplir ce formulaire pour enregistrer un nouveau véhicule.';
  dialogData: string = "";

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA
              ) public data: { id: string },
              public dialogRef: MatDialogRef<VehicleCreateComponent>) {


    this.vehicleForm = this.fb.group({

      zlCode: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{6}$')]],
      site: ['', Validators.required],
      owner: ['', Validators.required],
      category: ['', Validators.required],
      plate: ['', [Validators.required, Validators.pattern('^[A-Z0-9-]{6,10}$')]],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      firstUseYear: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    });


  }

  ngOnInit(): void {

    this.title="✅ Veuillez remplir ce formulaire pour enregistrer un nouveau véhicule."
    this.dialogData = this.data.id;
    console.log("ID",this.dialogData);
    if (this.dialogData) {

      this.isEdit = true;
      this.title = "✅ Vous pouvez porter certaines modifications";  // Title for edit mode

      this.vehicleService.getVehicle(this.dialogData).subscribe(
        {
          next: (response) => {
            this.vehicle = response.data;
            this.toastService.success(response.message)
            if (this.vehicle != null) {
              this.vehicleForm.setValue({
                zlCode: this.vehicle.zlCode,
                site: this.vehicle.site,
                owner: this.vehicle.owner,
                category: this.vehicle.category,
                plate: this.vehicle.plate,
                type: this.vehicle.type,
                brand: this.vehicle.brand,
                model: this.vehicle.model,
                year: this.vehicle.year,
                firstUseYear: this.vehicle.firstUseYear,
              });
              this.toastService.success(response.message);

            }
          },
          error: (error) => {
            const errorMessage = error?.error?.message || 'An unexpected error occurred';
            this.toastService.error(errorMessage)
          },
        }
      )
    }
  }

  onSubmit(): void {
    this.isLoading = true;

    // Check if the form is valid
    if (this.vehicleForm.valid) {
      if (this.isEdit) {
        // Update vehicle
        this.vehicleService.updateVehicle(this.vehicleForm.value, this.dialogData).subscribe(
          {
            next: (response) => {
              this.toastService.success(response.message);
              this.isLoading = false;
              this.closepopup();
            },
            error: (error) => {
              const errorMessage = error?.error?.message || 'An unexpected error occurred';
              console.error('Update failed', errorMessage);
              this.isLoading = false;
              this.toastService.error(errorMessage);
            },
          }
        );
      } else {
        // Create new vehicle
        this.vehicleService.createVehicle(this.vehicleForm.value).subscribe(
          {
            next: (response) => {
              this.toastService.success(response.message);
              this.isLoading = false;
              // Optionally reset the form if needed
              // this.vehicleForm.reset();
              this.closepopup();
            },
            error: (error) => {
              const errorMessage = error?.error?.message || 'An unexpected error occurred';
              console.error('Create failed', errorMessage);
              this.isLoading = false;
              this.toastService.error(errorMessage);
            },
          }
        );
      }
    } else {
      // Handle form validation failure
      this.isLoading = false;
      this.toastService.error('Please fill out the form correctly');
    }
  }



  closepopup() {
    this.dialogRef.close();
  }


}
