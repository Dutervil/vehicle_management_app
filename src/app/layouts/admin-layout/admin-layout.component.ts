import { CommonModule } from '@angular/common';
import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Chart} from "chart.js";
import {AuthService} from "../../auth/services/auth.service";
import {filter} from "rxjs";

@Component({
     standalone:true,
    selector: 'app-admin-layout',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  @ViewChild('appointmentChart') appointmentChart!: ElementRef;

  isSidebarOpen = true;

  username:string='';
  role:string=''
  currentPage:string = '';
  authService= inject(AuthService);
    router= inject(Router)
  constructor() {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentPage = event.urlAfterRedirects; // Get the current URL
      console.log('Current Route:', this.currentPage);
    });
    this.authService.currentUser.subscribe(user => {
      this.username= user ? user.username : null
      this.role= user ? user.role : null
    })

  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  isActive(route: string): boolean {
    return this.currentPage.includes(route);
  }
}
