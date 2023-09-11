import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
@Component({
  selector: 'app-activitypage',
  templateUrl: './activitypage.component.html',
  styleUrls: ['./activitypage.component.scss'],
})
export class ActivitypageComponent implements OnInit {
  employee_id: any;
  activityList: any = [];
  isComponentLoading: any;
  role_id: any;
  skip: number = 0;
  limit: number = 10;
  isFormEdit: boolean = false;
  editRowIndex: any;
  rowdata: any = {};
  params: any = {
    skip: this.skip,
    limit: this.limit,
  };
  isFormAdd: boolean = false;
  constructor(
    private _leaderboardService: LeaderboardService,
    private _authService: AuthService
  ) {}
  activity = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    points: new FormControl('', Validators.required),
    is_active: new FormControl('', Validators.required),
  });
  range = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
  });
  async ngOnInit() {
    this.isComponentLoading = true;
    this.employee_id = this._leaderboardService.employeeId;
    this.activityList = await this.getActivities();
    this.role_id = await this.getRole();
    console.log('Employee ID:', this.employee_id);
    console.log('Detail Page:', this.activityList);
    this.isComponentLoading = false;
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
  updateActivities(params: any) {
    return new Promise((resolve, reject) => {
      this._leaderboardService.updateActivities(params).subscribe(
        (res: any) => {
          resolve(res?.status);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  deleteActivities(params: any) {
    return new Promise((resolve, reject) => {
      this._leaderboardService.deleteActivities(params).subscribe(
        (res: any) => {
          resolve(res?.status);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }
  addActivity(params: any) {
    return new Promise((resolve, reject) => {
      this._leaderboardService.addActivity(params).subscribe(
        (res: any) => {
          resolve(res?.status);
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
    this.activityList = this.activityList.concat(await this.getActivities());
    console.log('onScrollDown activity Page', this.activityList);
  }
  editActivity(index: number) {
    if (index == this.editRowIndex) {
      this.isFormEdit = false;
    } else {
      this.isFormEdit = true;
      this.editRowIndex = index;
    }
  }
  async deleteActivity(rowdata: any, index: number) {
    let res = await this.deleteActivities(rowdata.id);
    if (res) {
      this.activityList.splice(index, 1);
      console.log(this.activityList);
    }
  }
  async onedit(rowdata: any, index: number) {
    this.activity.value.id = rowdata.id;
    console.log('Edit Form values', this.activity.value);
    let res = await this.updateActivities(this.activity.value);
    if (res) {
      this.activityList[index] = this.activity.value;
    }
    this.activity.reset()
  }

  addActivityForm() {
    this.isFormAdd = !this.isFormAdd;
  }
  async onAdd() {
    console.log('Add Form values', this.activity.value);
    let res = await this.addActivity(this.activity.value);
    if (res) {
      let id = this.activityList[this.activityList.length-1].id
      this.activity.value.id = id+1
      this.activityList.push(this.activity.value);
    }
    this.activity.reset()
    this.isFormAdd = false
    this.params.skip = 0
    this.activityList = await this.getActivities();
  }
}
