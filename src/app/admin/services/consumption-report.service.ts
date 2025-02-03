import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConsumptionReport} from "../interfaces";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConsumptionReportService {


  private apiUrl = environment.apiUrl + '/vehicle-report';
  constructor(private http: HttpClient) {}

  getReports(): Observable<ConsumptionReport[]> {
    return this.http.get<ConsumptionReport[]>(this.apiUrl);
  }

  getReport(id: string): Observable<ConsumptionReport> {
    return this.http.get<ConsumptionReport>(`${this.apiUrl}/${id}`);
  }

  createReport(report: ConsumptionReport): Observable<ConsumptionReport> {
    return this.http.post<ConsumptionReport>(this.apiUrl, report);
  }

  updateReport(id: string, report: ConsumptionReport): Observable<ConsumptionReport> {
    return this.http.put<ConsumptionReport>(`${this.apiUrl}/${id}`, report);
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
