import { Routes } from '@angular/router';

import { LoginComponent } from './auth/components/login/login.component';

 import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {AdminDashboardComponent} from "./admin/components/admin-dashboard/admin-dashboard.component";
import {AuthGuard} from "./auth/guard/auth.guard";
import {VehicleListComponent} from "./admin/components/vehicle-list/vehicle-list.component";
import {VehicleCreateComponent} from "./admin/components/vehicle-create/vehicle-create.component";
 export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' }, // Redirect from /patient to /patient/overview
      { path: 'overview', component: AdminDashboardComponent },
      {path:'vehicle/list',component:VehicleListComponent},
      {path:'vehicle/add',component:VehicleCreateComponent},
    ],
  },


  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
