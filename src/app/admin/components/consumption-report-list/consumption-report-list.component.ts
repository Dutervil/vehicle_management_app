import { Component } from '@angular/core';
import {ConsumptionReport} from "../../interfaces";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ConsumptionReportService} from "../../services/consumption-report.service";
import {ConsumptionReportFormComponent} from "../consumption-report-form/consumption-report-form.component";
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {NgIf} from "@angular/common";
import {VehicleService} from "../../services/vehicle-service";

@Component({
  selector: 'app-consumption-report-list',
  standalone: true,
  imports: [MatDialogModule, MatButton, MatCell, MatCellDef, MatColumnDef, MatFormField, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatInput, MatLabel, MatPaginator, MatRow, MatRowDef, MatTable, NgIf],
  templateUrl: './consumption-report-list.component.html',
  styleUrl: './consumption-report-list.component.css'
})
export class ConsumptionReportListComponent {

  reports: ConsumptionReport[] = [];

  constructor(private dialog: MatDialog, private reportService: ConsumptionReportService, private vehicleService: VehicleService) {
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports().subscribe(reports => {
      this.reports = reports;
    });
  }

  openForm(report?: ConsumptionReport): void {
    const dialogRef = this.dialog.open(ConsumptionReportFormComponent, {
      width: '900px',

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


}
