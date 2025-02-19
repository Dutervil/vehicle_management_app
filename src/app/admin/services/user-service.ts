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
export class UserService {



  http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllUser(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/user/all`);
  }


  saveUser(data:any): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/user/create`,data);
  }

  updateUser(data:any,id:string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/user/${id}`,data);
  }

}
