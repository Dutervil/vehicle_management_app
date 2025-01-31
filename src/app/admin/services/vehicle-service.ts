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

  createVehicle(data  :any):Observable<ApiResponse<Vehicle>> {
    return this.http.post<ApiResponse<Vehicle>>(`${this.apiUrl}/vehicles`,data);
  }
}
