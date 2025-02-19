import { Routes } from '@angular/router';

import { LoginComponent } from './auth/components/login/login.component';

 import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {AdminDashboardComponent} from "./admin/components/admin-dashboard/admin-dashboard.component";
import {AuthGuard} from "./auth/guard/auth.guard";
import {VehicleListComponent} from "./admin/components/vehicle-list/vehicle-list.component";
import {VehicleCreateComponent} from "./admin/components/vehicle-create/vehicle-create.component";
import {
  ConsumptionReportListComponent
} from "./admin/components/consumption-report-list/consumption-report-list.component";
import {SettingComponent} from "./admin/components/setting/setting.component";
import {UserComponent} from "./admin/components/user/user.component";
import {VehicleViewComponent} from "./admin/components/vehicle-view/vehicle-view.component";
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
      {path:'vehicle/report',component:ConsumptionReportListComponent},
      { path: 'vehicle/view/:id', component: VehicleViewComponent },
      {path:'setting',component:SettingComponent},
      {path:'user',component:UserComponent},
    ],
  },


  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
