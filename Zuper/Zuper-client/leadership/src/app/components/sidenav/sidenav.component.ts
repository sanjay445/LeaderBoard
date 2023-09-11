import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private _authService: AuthService, private router: Router) { }
  userData:any
  ngOnInit(): void {
    this.userData = this._authService.userData
  }
  openConfig(){
    this.router.navigate(['/config']);
  }
}
