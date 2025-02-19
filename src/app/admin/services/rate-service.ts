import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "../../interfaces/api-response.model";
import {MonthlyStatisticsDto, Rate} from "../interfaces";

@Injectable({
  providedIn: 'root',
})
export class RateService {
  http = inject(HttpClient);
  private apiUrl = environment.apiUrl;



  getRates(): Observable<ApiResponse<Rate[]>> {
    return this.http.get<ApiResponse<Rate[]>>(`${this.apiUrl}/rates`);
  }

  getActiveRate(): Observable<ApiResponse<Rate>> {
    return this.http.get<ApiResponse<Rate>>(`${this.apiUrl}/rates/active`);
  }

  createRate(data:any): Observable<ApiResponse<Rate>> {
    return this.http.post<ApiResponse<Rate>>(`${this.apiUrl}/rates`,data);
  }



}
