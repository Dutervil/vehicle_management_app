import {Component, Inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {  Rate} from "../../interfaces";
import {  NgIf} from "@angular/common";
 import {MatButton} from "@angular/material/button";
 import {  MatFormField, MatLabel, } from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {RateService} from "../../services/rate-service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-rate-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './rate-form.component.html',
  styleUrl: './rate-form.component.css'
})
export class RateFormComponent implements  OnInit{

  form: FormGroup;
  title = "Ajout du nouveau Taux"
  isLoading = false;

  constructor(private dialogRef: MatDialogRef<RateFormComponent>,
              @Inject(MAT_DIALOG_DATA) private data: Rate,
              private fb: FormBuilder,
              private rateService:RateService,
              private toastService:ToastrService
              )  {
          this.form = this.fb.group({
            rate: [data ? data.rate : '', [Validators.required, currencyValidator()]]
           });

  }

  ngOnInit(): void {
    if (this.data) {
      this.title = "Moditier Ce taux"
    }

  }

  onSubmit() {
    if (this.form.valid) {

      const formData={
        rate:Number(this.form.get('rate')?.value)
      }
      this.isLoading = true;
      if(this.data){

      }else{
       this.rateService.createRate(formData).subscribe({
         next:(response)=>{
           this.isLoading = false;
           this.form.reset();
           this.toastService.success(response.message)
           this.dialogRef.close()
         },
         error:(err)=>{
           const errorMessage =err?.error?.message;
           this.isLoading = false;
           console.log(err)
           this.toastService.error(errorMessage)
         }
       })
      }
    }
  }

  onCancel() {
   this.dialogRef.close()
  }
}

export function currencyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Regular expression to validate a valid currency format
    // This allows optional commas for thousands and supports up to 3 decimal places
    const regex = /^\d+(\.\d{1,3})?$/;

    // If value doesn't match the regex, return an error
    if (value && !regex.test(value)) {
      return {invalidCurrency: true};
    }

    return null;
  };
}
