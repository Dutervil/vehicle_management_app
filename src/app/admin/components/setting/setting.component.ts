import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import { MatIconModule} from "@angular/material/icon";
import {RateService} from "../../services/rate-service";
import {Rate} from "../../interfaces";
import {Subscription} from "rxjs";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DatePipe, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {RateFormComponent} from "../rate-form/rate-form.component";

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    MatTab,
    MatIconModule,
    MatTabGroup,
    MatTabLabel,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatTable,
    MatSort,
    DatePipe,
    NgIf,
    MatButton
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements  OnInit, AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  rates:Rate[]=[]
  isLoading: boolean = true;

  subscription = new Subscription();
  displayedColumns: string[] = [  'rate', 'createdAt', 'status','action'];
  dataSource: MatTableDataSource<Rate>;


  constructor(private  rateService:RateService,private dialog: MatDialog) {
    this.dataSource=new MatTableDataSource(this.rates)
  }

  ngOnInit(): void {
   this.loadRates();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRates(): void {
    let sub =this.rateService.getRates().subscribe(
      {
        next: (response) => {

          this.rates=response.data;
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.rates);
          console.log(this.rates)
        },
        error: (error ) => {
          const errorMessage = error?.error?.message || 'An unexpected error occurred';

          this.isLoading = false;
        },
      }

    );
    this.subscription.add(sub)
  }



  openForm(rate?:Rate) {
    const dialogRef = this.dialog.open(RateFormComponent, {
      width: '800px',
      enterAnimationDuration:"1000ms",
      exitAnimationDuration:"1000ms",
      disableClose:true,
      hasBackdrop:true,
      data: rate ? rate : null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadRates()

    });
  }

  editRate(rate:Rate) {
    const dialogRef = this.dialog.open(RateFormComponent, {
      width: '800px',
      enterAnimationDuration:"1000ms",
      exitAnimationDuration:"1000ms",
      disableClose:true,
      hasBackdrop:true,
      data: rate ? rate : null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadRates()

    });
  }

  deleteRate(rate:Rate) {

  }


}
