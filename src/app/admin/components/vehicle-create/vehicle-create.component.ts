import {Component, Inject, inject, Signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {VehicleService} from "../../services/vehicle-service";
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-vehicle-create',
    standalone:true,
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
export class VehicleCreateComponent {

  isLoading: boolean = false;
  vehicleForm: FormGroup;
  vehicleService=inject(VehicleService)
toastService=inject(ToastrService)

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA
              ) public data: any,
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

    if (this.data?.vehicle) {
      this.vehicleForm.patchValue(this.data.vehicle);
    }
  }





  onSubmit(): void {

    if (this.vehicleForm.valid) {
      this.isLoading = true;
      this.vehicleService.createVehicle(this.vehicleForm.value).subscribe(
        {
          next: (response) => {
            this.toastService.success(response.message)
            this.isLoading = false;
            this.vehicleForm.reset();
            this.dialogRef.close(true);
          },
          error: (error) => {
            const errorMessage = error?.error?.message || 'An unexpected error occurred';
            console.error('Login failed', errorMessage);
            this.isLoading = false;
            this.toastService.error(errorMessage)
          },
        }
      );
    }else {
      this.toastService.error("Erreur lors du sauvegarde du formulaire")
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
