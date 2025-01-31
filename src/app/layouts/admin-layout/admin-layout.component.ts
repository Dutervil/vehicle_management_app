import { CommonModule } from '@angular/common';
import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {Chart} from "chart.js";
import {AuthService} from "../../auth/services/auth.service";

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
  currentPage = 'Dashboard';
  authService= inject(AuthService);
    router= inject(Router)
  constructor() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth < 992 &&
        !target.closest('.sidebar') &&
        !target.closest('.sidebar-toggle') &&
        this.isSidebarOpen) {
        this.isSidebarOpen = false;
      }
    });

    this.username=this.authService.getUserData()?.username;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSidebarCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  setActivePage(page: string) {
    this.currentPage = page.charAt(0).toUpperCase() + page.slice(1);
    if (window.innerWidth < 992) {
      this.isSidebarOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
