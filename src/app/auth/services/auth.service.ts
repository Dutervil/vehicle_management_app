import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';

import {AuthData, User} from '../interface/Iuser';
import {environment} from "../../environments/environment";
import {ApiResponse} from "../../interfaces/api-response.model";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root',
})
export class AuthService {




  private apiUrl = environment.apiUrl;
  private tokenKey = 'token';
  public currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }


  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  setCurrentUser(user: User) {
    // Set the current user in the BehaviorSubject
    this.currentUserSubject.next(user);
    // Store user details in localStorage (if necessary, for persistence across page reloads)
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  get isAuthenticated() {
    return  !!this.token && !!this.currentUserSubject.value;
  }


  login(credentials: any): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/auth/signing`, credentials)
  }



  private loadUserFromLocalStorage() {
    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));  // Set user data if present in localStorage
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }




  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      this.logout();
      return null;
    }
    return payload;
  }
}
