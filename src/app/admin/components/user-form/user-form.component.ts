import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConsumptionReport} from "../../interfaces";
import {User} from "../../../auth/interface/Iuser";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {UserService} from "../../services/user-service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    NgIf,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit{
  form: FormGroup;
  isLoading: boolean = false;
  title="Creer un nouveau Utilisateur"
  constructor( private fb: FormBuilder,private dialogRef: MatDialogRef<UserFormComponent>,
               @Inject(MAT_DIALOG_DATA) private data: User, private userService:UserService,
               private  toastService:ToastrService

  ) {
    console.log("Data",{data})

    this.form = this.fb.group({

      email: [data ? data.email : '', Validators.required],
      username: [data ? data.username : '', Validators.required],
      password: [data ? data.password : '', Validators.required],
      role: [data ? data.role : 'ADMIN', Validators.required],
      status: [data ? data.status : 'ACTIVE', Validators.required],
    })
  }

  ngOnInit(): void {

    if (this.data) {
      this.title="Modifier cet Utilisateur"
      this.form.get('id')?.setValue(this.data.id);
    }

  }

  onSubmit() {
    if (this.form.valid) {

    }


    if(this.data){

      this.userService.updateUser(this.form.value,this.data.id).subscribe({
        next:(response)=>{
          this.toastService.success(response.message)
          this.dialogRef.close();

        },
        error:(error)=>{
          const errorMessage = error?.error?.message || 'An unexpected error occurred';
          this.toastService.success(errorMessage)
        }
      });

    }else{
      this.userService.saveUser(this.form.value).subscribe({
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

  closepopup() {
    this.dialogRef.close();
  }
}
