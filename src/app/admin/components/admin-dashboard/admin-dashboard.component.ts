import {Component, ElementRef, ViewChild} from '@angular/core';
import {Chart} from "chart.js";

@Component({
    selector: 'app-admin-dashboard',
  standalone:true,
    imports: [],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  @ViewChild('appointmentChart') appointmentChart!: ElementRef;

  isSidebarOpen = true;

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
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
