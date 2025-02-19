import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";

import {MatPaginator} from "@angular/material/paginator";
import {NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";


import {UserService} from "../../services/user-service";
import {User} from "../../../auth/interface/Iuser";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ConsumptionReport} from "../../interfaces";
import {ConsumptionReportFormComponent} from "../consumption-report-form/consumption-report-form.component";
import {UserFormComponent} from "../user-form/user-form.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [

    MatCell,
    MatCellDef,
    MatColumnDef,

    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,

    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    MatSlideToggle,
    FormsModule,
    MatIcon,
    MatIconButton,
    MatHeaderCellDef,
    MatPaginator,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent  implements AfterViewInit,OnInit{
  isLoading:boolean=false;
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  subscription = new Subscription();
  @ViewChild(MatPaginator) paginator!: MatPaginator  ;

  constructor(private userService: UserService,private dialog: MatDialog,) {}
  ngOnInit() {
    this.fetchUsers();  // Fetch users when the component is initialized
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  updateStatus(user: User) {
    user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    console.log('Updated status:', user.status);
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '900px',
      enterAnimationDuration:"1000ms",
      exitAnimationDuration:"1000ms",
      disableClose:true,
      hasBackdrop:true,
      data: user ? user : null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchUsers();

    });
  }




  fetchUsers() {


    this.userService.getAllUser().subscribe({
      next:(response)=>{
        this.dataSource.data = response.data;
        console.log('Fetched users:', response);
      },
      error:(err)=>{
        console.log('Fetched users:', err);
    }
    })

  }



  applyFilter(event: KeyboardEvent) {
    this.dataSource.filter=(event.target as HTMLInputElement).value.trim().toLowerCase();

    // reset the pagination to the first page
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  addNewUser(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '900px',
      enterAnimationDuration:"1000ms",
      exitAnimationDuration:"1000ms",
      disableClose:true,
      hasBackdrop:true,
      data: user ? user : null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchUsers();

    });
  }

}
