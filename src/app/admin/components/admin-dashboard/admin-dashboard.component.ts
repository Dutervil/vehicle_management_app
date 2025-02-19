import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';

import Chart from 'chart.js/auto';
import {ConsumptionReport, StatisticsDto} from "../../interfaces";
import {StatService} from "../../services/stat-service";
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ArcElement, Legend, Tooltip} from "chart.js";
import {ConsumptionReportService} from "../../services/consumption-report.service";
import {AuthService} from "../../../auth/services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
Chart.register(ArcElement, Tooltip, Legend);
@Component({
    selector: 'app-admin-dashboard',
  standalone:true,
  imports: [
    DecimalPipe,
    DatePipe,
    NgForOf,
    CurrencyPipe,
    NgClass,
    NgIf
  ],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent  implements  OnInit {
  @ViewChild('appointmentChart') appointmentChart!: ElementRef;
  stats: StatisticsDto = {
    totalGallons: 0,
    totalVehicles: 0,
    totalInsuranceCost: 0,
    totalRepairCost: 0,
    totalMaintenanceCost: 0,
    totalRentalCost: 0
  };
  private chartInstance: Chart | null = null;
  private biechartInstance: Chart | null = null;
  lastFiveRecord!:ConsumptionReport[];
  ngOnInit(): void {
    this.loadMonthlyStats();
    this.loadStats();
    this.loadTwelveMonthDate()
    this.loadFuelTypeChart()

  }

  role:string=''


  isSidebarOpen = true;

  constructor( private statService: StatService, private reportService:ConsumptionReportService, private authService:AuthService) {

    this.authService.currentUser.subscribe(user => {

      this.role= user ? user.role : null
    })
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  lastFiveRecordData() {
    this.reportService.last5Record().subscribe({
      next: (response) => {
        this.lastFiveRecord = response.data;

      }
    })
  }


  loadStats() {
    this.statService.getDashboardStat().subscribe({
      next: (response) => {
        this.stats = response.data;

      }
    })
    this.lastFiveRecordData();
  }

  loadMonthlyStats() {
    this.statService.getMonthlyStat().subscribe({
      next: (response) => {
        this.createBarChart(response.data)

      }
    })
  }

  loadTwelveMonthDate() {
    this.statService.getMonthlyStatTwelve().subscribe({
      next: (response) => {
        this.createBarChartTwelve(response.data)
      }
    })
  }


  createBarChart(data: any[]) {
    const labels = data.map(item => item.month);
    const gallonsData = data.map(item => item.totalGallons);
    const repairCostData = data.map(item => item.totalRepairCost);
    const totalInsuranceCost = data.map(item => item.totalInsuranceCost);
    const totalMaintenanceCost = data.map(item => item.totalMaintenanceCost);

    new Chart('barChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Gallons',
            data: gallonsData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Repair Costs',
            data: repairCostData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          },

          {
            label: 'Insurance Cost',
            data: totalInsuranceCost,
            backgroundColor: 'rgba(9,52,97,0.8)',
          },
          {
            label: 'Cout Maintenance',
            data: totalMaintenanceCost,
            backgroundColor: 'rgb(234,122,6)',
          },

        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

  }


  createBarChartTwelve(data: any[]) {
    // ✅ Vérifier s'il existe déjà un graphique, puis le détruire
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const totalGallons = Array(12).fill(0);
    const totalInsuranceCost = Array(12).fill(0);
    const totalRepairCost = Array(12).fill(0);
    const totalMaintenanceCost = Array(12).fill(0);
    const totalRentalCost = Array(12).fill(0);

    data.forEach(item => {
      const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;
      totalGallons[monthIndex] = item.totalGallons;
      totalInsuranceCost[monthIndex] = item.totalInsuranceCost;
      totalRepairCost[monthIndex] = item.totalRepairCost;
      totalMaintenanceCost[monthIndex] = item.totalMaintenanceCost;
      totalRentalCost[monthIndex] = item.totalRentalCost;
    });

    // ✅ Créer une nouvelle instance du graphique
    this.chartInstance = new Chart('barChartTwelve', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Total Gallons',
            data: totalGallons,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Insurance Cost',
            data: totalInsuranceCost,
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          },
          {
            label: 'Repair Cost',
            data: totalRepairCost,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Maintenance Cost',
            data: totalMaintenanceCost,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Rental Cost',
            data: totalRentalCost,
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // ✅ Désactive le ratio fixe
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }

  loadFuelTypeChart(){
    this.reportService.last5Record().subscribe({
      next: (response) => {

        this.createFuelTypeChart(response.data);
      }
    })
  }

createFuelTypeChart(data: any) {
  const canvas = document.getElementById('fuelTypeChart') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (this.biechartInstance) {
    this.biechartInstance.destroy();
  }
  const totalDiesel = data
    .filter((report: any) => report.fuelType === 'Diesel')
    .reduce((sum: number, report: any) => sum + report.totalFuelCost, 0);

  const totalGasoline = data
    .filter((report: any) => report.fuelType === 'Gasoline')
    .reduce((sum: number, report: any) => sum + report.totalFuelCost, 0);

  this.biechartInstance=new Chart(ctx!, {
    type: 'pie',
    data: {
      labels: ['Diesel', 'Gasoline'],
      datasets: [
        {
          data: [totalDiesel, totalGasoline],
          backgroundColor: ['rgba(9,52,97,0.8)', '#FF9800'], // Couleurs pour diesel et gasoline
          hoverBackgroundColor: ['rgba(9,52,97,0.8)', '#FFB74D'],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,

      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              return `${tooltipItem.label}: HTG ${tooltipItem.raw.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

}


