import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ApiResponse} from "../../interfaces/api-response.model";
import {User} from "../../auth/interface/Iuser";
import {Vehicle} from "../interfaces";


@Injectable({
  providedIn: 'root',
})
export class VehicleService {



  http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getVehicles(): Observable<ApiResponse<Vehicle[]>> {
    return this.http.get<ApiResponse<Vehicle[]>>(`${this.apiUrl}/vehicles`);
  }

  getVehicle(id:string): Observable<ApiResponse<Vehicle>> {

    return this.http.get<ApiResponse<Vehicle>>(`${this.apiUrl}/vehicles/${id}`);
  }

  getVehicleReports(id:string,startDate: string, endDate: string): Observable<ApiResponse<Vehicle>> {
    const body = {
      startDate: startDate,  // Start date as string in ISO 8601 format
      endDate: endDate       // End date as string in ISO 8601 format
    };
    return this.http.post<ApiResponse<Vehicle>>(`${this.apiUrl}/vehicles/${id}/range`,body);
  }


  deleteVehicle(id:string): Observable<ApiResponse<void>> {

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/vehicles/${id}`);
  }

  createVehicle(data  :any):Observable<ApiResponse<Vehicle>> {
    return this.http.post<ApiResponse<Vehicle>>(`${this.apiUrl}/vehicles`,data);
  }

  updateVehicle(data  :any,id:string):Observable<ApiResponse<Vehicle>> {
    return this.http.put<ApiResponse<Vehicle>>(`${this.apiUrl}/vehicles/${id}`,data);
  }
}
