import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "../../interfaces/api-response.model";
import {MonthlyStatisticsDto, StatisticsDto, Vehicle} from "../interfaces";

@Injectable({
  providedIn: 'root',
})
export class StatService {
  http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDashboardStat(): Observable<ApiResponse<StatisticsDto>> {
    return this.http.get<ApiResponse<StatisticsDto>>(`${this.apiUrl}/stats`);
  }

  getMonthlyStat(): Observable<ApiResponse<MonthlyStatisticsDto[]>> {
    return this.http.get<ApiResponse<MonthlyStatisticsDto[]>>(`${this.apiUrl}/stats/monthly`);
  }

  getMonthlyStatTwelve(): Observable<ApiResponse<MonthlyStatisticsDto[]>> {
    return this.http.get<ApiResponse<MonthlyStatisticsDto[]>>(`${this.apiUrl}/stats/twelve`);
  }
}
