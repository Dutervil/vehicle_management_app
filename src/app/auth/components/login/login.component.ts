import {Component, inject, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from "../../interface/Iuser";
import { CommonModule, } from '@angular/common';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';






@Component({
    selector: 'app-login',
  standalone:true,
    imports: [ReactiveFormsModule, CommonModule,],
    providers: [AuthService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit{



  loginForm: FormGroup;
  showPassword: boolean = false;


  constructor(private authService: AuthService, private router: Router,private fb: FormBuilder,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if(this.authService.getUserData()){
      this.router.navigate(['/admin']);
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }





  onSubmit() {
    this.authService.login({ email: this.loginForm.value.email, password: this.loginForm.value.password }).subscribe({
      next: (response) => {
        const user: User = response.data;
        this.toastr.success(response.message,"Success Message")

        this.authService.setUserData(response.data);
        const userRole :string=response?.data?.role.toLowerCase()
          this.router.navigate(['/admin']);
      },
      error: (error) => {

        const errorMessage = error?.error?.message || 'An unexpected error occurred';
        console.error('Login failed', errorMessage);
        this.toastr.error(errorMessage,"Error Message")

      },
    });
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }




}
