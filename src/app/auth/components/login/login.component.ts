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
  isLoading = false;

  constructor(private authService: AuthService, private router: Router,private fb: FormBuilder,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if(this.authService.isAuthenticated){
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

    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.authService.login({ email: this.loginForm.value.email, password: this.loginForm.value.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.data.token);
        this.authService.setCurrentUser(response.data.user);
        this.toastr.success(response.message,"Success Message")

        if(response.data.user.role=="REPORTER"){
          this.router.navigate(['/admin/vehicle/report']);

        }else{
          this.router.navigate(['admin/overview']);

        }

        this.isLoading = false;
      },
      error: (error) => {

        const errorMessage = error?.error?.message || 'Veuillez demarrer votre serveur';
        console.error('Login failed', errorMessage);
        this.toastr.error(errorMessage,"Probleme de connection")
        this.isLoading = false;

      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }




}
