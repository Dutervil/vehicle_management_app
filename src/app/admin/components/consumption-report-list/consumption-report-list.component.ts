import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConsumptionReport} from "../../interfaces";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ConsumptionReportService} from "../../services/consumption-report.service";
import {ConsumptionReportFormComponent} from "../consumption-report-form/consumption-report-form.component";
import {MatButton, MatIconButton} from "@angular/material/button";
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
import {DatePipe, DecimalPipe, NgIf} from "@angular/common";
import {VehicleService} from "../../services/vehicle-service";
import {MatSort} from "@angular/material/sort";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {ConfirmDialogComponent} from "../../../../components/confirm-dialog/confirm-dialog.component";
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-consumption-report-list',
  standalone: true,
  imports: [MatDialogModule, MatButton,
    MatExpansionModule,
    MatCell, MatCellDef, MatColumnDef, MatFormField, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatInput, MatLabel, MatPaginator, MatRow, MatRowDef, MatTable,   MatHeaderCellDef, MatProgressSpinner, NgIf,    MatChipSet, MatChip, DecimalPipe, ],
  templateUrl: './consumption-report-list.component.html',
  styleUrl: './consumption-report-list.component.css'
})
export class ConsumptionReportListComponent  implements AfterViewInit, OnInit,OnDestroy{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<ConsumptionReport>([])
  displayedColumns: string[] = [ 'vehicule', 'startKm','endKm', 'totalKm','costPerKm', 'fuelType', 'fuelQuantityGallons',
    'pricePerGallon','totalFuelCost', 'costPerKm', 'consumptionPer100Km','totalCost','estimatedCostHTG','estimatedCostUSD','Action'];
  isLoading:boolean=true;
  hasData:boolean=true;

  constructor(private dialog: MatDialog, private reportService: ConsumptionReportService, private toastService:ToastrService) {
  }

  ngOnInit(): void {
    this.loadReports();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
        this.loadReports();

    });
  }

  deleteReport(report: ConsumptionReport): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Êtes-vous sûr de vouloir continuer ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let sub= this.reportService.deleteReport(report.id).subscribe(
          {
            next: (response) => {
              this.toastService.success(response.message)
              this.loadReports()
            },
            error: (error) => {
              const errorMessage = error?.error?.message || 'An unexpected error occurred';
              console.error('Login failed', errorMessage);
              this.toastService.error(errorMessage)
            },

            complete:()=>{
              this.loadReports()
            }
          }
        );
        this.subscription.add(sub)

      } else {
        console.log('Action annulée');
      }
    });

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected readonly Number = Number;

  editReport(report:ConsumptionReportService) {
    const dialogRef = this.dialog.open(ConsumptionReportFormComponent, {
      width: '900px',
      enterAnimationDuration:"1000ms",
      exitAnimationDuration:"1000ms",
      disableClose:true,
      hasBackdrop:true,
      data: report ? report : null
    });
    dialogRef.afterClosed().subscribe(()=>{
      this.loadReports();
    })
  }


}
