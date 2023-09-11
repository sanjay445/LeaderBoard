import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private _http:HttpClient) { }
  employeeId:any

  getActivities(params:any) {
    return this._http.post('/api/getActivities',{params});
  }
  deleteActivities(params:any) {
    return this._http.post('/api/deleteActivity', {params});
  }
  addActivity(params:any) {
    return this._http.post('/api/addActivity', {params});
  }
  addEmployee(associate_id:any) {
    return this._http.post('/api/addEmployee', {associate_id});
  }
  addEmployeeActivity(params:any) {
    return this._http.post('/api/addEmployeeActivity', {params});
  }
  getEmployeesRankWise(params:any) {
    return this._http.post('/api/getEmployeesRankWise', {params});
  }
  getEmployeeActivityDetails(params:any) {
    return this._http.post('/api/getEmployeeActivityDetails', {params});
  }
  
  checkUser(params: any) {
    return this._http.post('/api/onLogin', { params });
  }
  setEmployeeId(data:any) {
    this.employeeId = data
  }
  updateActivities(params:any) {
    return this._http.post('/api/updateActivities', {params});
  }
}
