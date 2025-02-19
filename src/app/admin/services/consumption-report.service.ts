import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConsumptionReport} from "../interfaces";
import {environment} from "../../environments/environment";
import {ApiResponse} from "../../interfaces/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class ConsumptionReportService {


  private apiUrl = environment.apiUrl + '/vehicle-report';
  constructor(private http: HttpClient) {}

  getReports(): Observable<ApiResponse<ConsumptionReport[]>> {
    return this.http.get<ApiResponse<ConsumptionReport[]>>(this.apiUrl);
  }

  last5Record(): Observable<ApiResponse<ConsumptionReport[]>> {
    return this.http.get<ApiResponse<ConsumptionReport[]>>(this.apiUrl+'/last5Record');
  }
  getReport(id: string): Observable<ConsumptionReport> {
    return this.http.get<ConsumptionReport>(`${this.apiUrl}/${id}`);
  }

  createReport(report: ConsumptionReport): Observable<ApiResponse<ConsumptionReport>> {
    return this.http.post<ApiResponse<ConsumptionReport>>(this.apiUrl, report);
  }

  updateReport(id: string, report: ConsumptionReport): Observable<ApiResponse<ConsumptionReport>> {
    return this.http.patch<ApiResponse<ConsumptionReport>>(`${this.apiUrl}/${id}`, report);
  }

  deleteReport(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
