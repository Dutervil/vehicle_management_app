import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import {AuthService} from "../services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const user = this.authService.getUserData();

    // If no user data is found, redirect to login
    if (user==null) {
      console.error('No user found');
      this.router.navigate(['/login']);
      return false;
    }

    // Ensure that the user has a role and check if it matches the expected role
    const userRole = user.role?.toLowerCase();
    console.log('Role from Guard is:', userRole);

    if (!userRole || userRole !== expectedRole.toLowerCase()) {
      console.error(`Access denied. User role ${userRole} is not authorized.`);
      this.router.navigate(['/login']);
      return false;
    }

    // User is authenticated and has the correct role
    return true;
  }
}
