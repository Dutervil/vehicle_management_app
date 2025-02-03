import { CommonModule } from '@angular/common';
import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {Chart} from "chart.js";
import {AuthService} from "../../auth/services/auth.service";
import {filter} from "rxjs";

@Component({
     standalone:true,
    selector: 'app-admin-layout',
    imports: [RouterOutlet, CommonModule, RouterLink],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  @ViewChild('appointmentChart') appointmentChart!: ElementRef;

  isSidebarOpen = true;
  isSidebarCollapsed = false;
  username:string='';
  currentPage:string = '';
  authService= inject(AuthService);
    router= inject(Router)
  constructor() {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentPage = event.urlAfterRedirects; // Get the current URL
      console.log('Current Route:', this.currentPage);
    });
    this.username=this.authService.getUserData()?.username;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSidebarCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  isActive(route: string): boolean {
    return this.currentPage.includes(route);
  }
}
