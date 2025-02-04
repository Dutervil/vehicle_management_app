import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ConsumptionReport} from "../../interfaces";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ConsumptionReportService} from "../../services/consumption-report.service";
import {ConsumptionReportFormComponent} from "../consumption-report-form/consumption-report-form.component";
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {DatePipe, NgIf} from "@angular/common";
import {VehicleService} from "../../services/vehicle-service";
import {MatSort} from "@angular/material/sort";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-consumption-report-list',
  standalone: true,
  imports: [MatDialogModule, MatButton, MatCell, MatCellDef, MatColumnDef, MatFormField, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatInput, MatLabel, MatPaginator, MatRow, MatRowDef, MatTable, DatePipe, MatHeaderCellDef, MatProgressSpinner, NgIf],
  templateUrl: './consumption-report-list.component.html',
  styleUrl: './consumption-report-list.component.css'
})
export class ConsumptionReportListComponent  implements AfterViewInit, OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // reports: ConsumptionReport;
  dataSource = new MatTableDataSource<ConsumptionReport>([])
  displayedColumns: string[] = ['plate', 'brand', 'model', 'totalKm', 'fuelType', 'totalFuelCost', 'costPerKm', 'reportDate'];
  isLoading:boolean=true;
  hasData:boolean=true;

  constructor(private dialog: MatDialog, private reportService: ConsumptionReportService, private vehicleService: VehicleService) {
  }

  ngOnInit(): void {
    this.loadReports();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadReports(): void {
    this.reportService.getReports().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.isLoading = false;
        this.hasData= response.data.length > 0;
      },
      error: (error) => {
        console.error('Erreur de chargement des rapports:', error);
        this.isLoading = false;
        this.hasData=false;
      }
    });
  }

  openForm(report?: ConsumptionReport): void {
    const dialogRef = this.dialog.open(ConsumptionReportFormComponent, {
      width: '900px',
      enterAnimationDuration:"1000ms",
      exitAnimationDuration:"1000ms",
      disableClose:true,
      hasBackdrop:true,
      data: report ? report : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReports();
      }
    });
  }

  deleteReport(id: string): void {
    this.reportService.deleteReport(id).subscribe(() => {
      this.loadReports();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
