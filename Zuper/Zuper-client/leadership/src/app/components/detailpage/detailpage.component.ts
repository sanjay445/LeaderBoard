import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LeaderboardService } from 'src/app/services/leaderboard.service';

@Component({
  selector: 'app-detailpage',
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.scss'],
})
export class DetailpageComponent implements OnInit {
  employee_id: any;
  empActivityList: any = [];
  isComponentLoading: any;
  role_id: any;
  skip: number = 0;
  limit: number = 10;
  params:any={
    skip: this.skip,
    limit: this.limit,
    associate_id: '',
    start_date: '',
    end_date: '',
  };
  constructor(
    private _leaderboardService: LeaderboardService,
    private _authService: AuthService
  ) {}
  range = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
  });
  async ngOnInit() {
    this.isComponentLoading = true;
    this.employee_id = this._leaderboardService.employeeId;
    this.empActivityList = await this.getEmployeeActivityDetails();
    this.role_id = await this.getRole();
    console.log('Employee ID:', this.employee_id);
    console.log('Detail Page:', this.empActivityList);
    this.isComponentLoading = false;
  }

  getEmployeeActivityDetails() {
    return new Promise((resolve, reject) => {
      this.params.associate_id = this.employee_id
      this._leaderboardService.getEmployeeActivityDetails(this.params).subscribe(
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

  getRole() {
    return new Promise((resolve, reject) => {
      this._authService.getRole().subscribe(
        (res: any) => {
          resolve(res[0].role_id);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  async onScrollDown() {
    console.log('scroll');
    this.params.skip += this.limit;
    this.empActivityList = this.empActivityList.concat(
      await this.getEmployeeActivityDetails()
    );
    console.log('onScrollDown Detail Page', this.empActivityList);
  }

  getStartDate() {
    const originalDateString = this.range.value.start
    const originalDate = new Date(originalDateString);
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const day = originalDate.getDate().toString().padStart(2, '0');
    const start_date = `${year}-${month}-${day}`;
    console.log("start_date",start_date); 
    this.params.start_date = start_date
    this.params.end_date = ''
  }
  async getEndDate() {
    const originalDateString = this.range.value.end
    const originalDate = new Date(originalDateString);
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const day = originalDate.getDate().toString().padStart(2, '0');
    const end_date = `${year}-${month}-${day}`;
    console.log("end_date",end_date); 
    this.params.end_date = end_date
    this.empActivityList = await this.getEmployeeActivityDetails();
  }

}
