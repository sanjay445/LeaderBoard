import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LeaderboardService } from 'src/app/services/leaderboard.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  leaderBoard: any = [];
  isComponentLoading: any;
  role_id: any;
  skip: number = 0;
  limit: number = 10;
  userAid: any;
  params: any = {
    skip: this.skip,
    limit: this.limit,
    start_date: '',
    end_date: '',
  };
  selectedRowIndex:any
  activityList: any = [];
  addEmpFormFlag: boolean = false;
  activityParams: any = {};
  userData:any
  constructor(
    private _leaderboardService: LeaderboardService,
    private router: Router,
    private _authService: AuthService
  ) {}
  range = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
  });

  async ngOnInit() {
    this.isComponentLoading = true;
    this.userData = this._authService.userData
    this.role_id = await this.getRole();
    this.leaderBoard = await this.getEmployeesRankWise();
    this.activityList = await this.getActivities();
    console.log('OnInit Home page', this.leaderBoard);
    console.log('User role', this.role_id);
    this.isComponentLoading = false;
  }
  getEmployeesRankWise() {
    return new Promise((resolve, reject) => {
      this._leaderboardService.getEmployeesRankWise(this.params).subscribe(
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

  getActivities() {
    return new Promise((resolve, reject) => {
      this._leaderboardService.getActivities(this.params).subscribe(
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

  async onScrollDown() {
    console.log('scroll');
    this.skip += this.limit;
    this.leaderBoard += await this.getEmployeesRankWise();
    console.log('onScrollDown Home Page', this.leaderBoard);
  }

  async showDetail(item: any) {
    await this._leaderboardService.setEmployeeId(item.associate_id);
    this.router.navigate(['/detail']);
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

  getStartDate() {
    const originalDateString = this.range.value.start;
    const originalDate = new Date(originalDateString);
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const day = originalDate.getDate().toString().padStart(2, '0');
    const start_date = `${year}-${month}-${day}`;
    console.log('start_date', start_date);
    this.params.start_date = start_date;
    this.params.end_date = '';
  }
  async getEndDate() {
    const originalDateString = this.range.value.end;
    const originalDate = new Date(originalDateString);
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const day = originalDate.getDate().toString().padStart(2, '0');
    const end_date = `${year}-${month}-${day}`;
    console.log('end_date', end_date);
    this.params.end_date = end_date;
    this.leaderBoard = await this.getEmployeesRankWise();
  }
  addEmployeeActivity(params: any) {
    return new Promise((resolve, reject) => {
      this._leaderboardService.addEmployeeActivity(params).subscribe(
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
  addEmployee(aid: any) {
    return new Promise((resolve, reject) => {
      this._leaderboardService.addEmployee(aid).subscribe(
        (res: any) => {
          resolve(res.status);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }


  async addEmployeeForm(rowdata: any, index: any, event: any) {
    event.stopPropagation();
    this.addEmpFormFlag = !this.addEmpFormFlag;
    this.selectedRowIndex = index
    this.userAid = rowdata?.associate_id;
    
  }
  selectedActivity(val: any, index: number) {
    console.log("selected val:",val)
    this.activityParams.activity_name = val.name;
    this.activityParams.points = val.points;
  }
  async addDetails() {
    await this.addEmployeeActivity(this.activityParams);
    let res = await this.addEmployee(this.userAid);
    if(res){
      this.params.skip = 0
      this.leaderBoard = await this.getEmployeesRankWise();
    }
    this.addEmpFormFlag = false;
  }
}
