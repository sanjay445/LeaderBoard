import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private _authService: AuthService, private router: Router) {}
  checkUser = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  ngOnInit(): void {}

  login() {
    return new Promise((resolve, reject) => {
      this._authService.checkUser(this.checkUser.value).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getUserData() {
    return new Promise((resolve, reject) => {
      this._authService.getRole().subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  async onSubmit() {
    console.log('Form values', this.checkUser.value);
    let res: any = await this.login();
    this._authService.setRole(res);
    console.log('User Date', res);
    if (res.length != 0) {
      this.router.navigate(['/home']);
    }
    await this.getUserData()
  }

}
