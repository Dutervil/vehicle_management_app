import { HttpClient } from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../interface/Iuser';
import {environment} from "../../environments/environment";
import {ApiResponse} from "../../interfaces/api-response.model";



@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();


  http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Login method

  login(credentials: any): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/auth/signing`, credentials);
  }


  setUserData(userData: any) {
    this.userSubject.next(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Get the current user data
  getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;

  }


  // Logout method
  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');

  }
}
