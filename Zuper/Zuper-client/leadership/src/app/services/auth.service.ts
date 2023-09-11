import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  activitySubject = new BehaviorSubject<any>(1);
  userData = []
  checkUser(params: any) {
    return this._http.post('/api/onLogin', { params });
  }
  setRole(data:any) {
    this.userData = data
    this.activitySubject.next(data);
  }
  getRole = () => {
    return this.activitySubject.asObservable();
  };
}
