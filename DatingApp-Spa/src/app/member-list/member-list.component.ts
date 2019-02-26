import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/_services/UserService.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { User } from 'src/_models/User';
import { PaginatedResult, Pagination } from 'src/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any = {};
  pagination: Pagination = new Pagination();
  pageSize = 5;

  constructor(private userService: UserServiceService, private alertify: AlertifyService) { }

  ngOnInit() {

    this.setParamDefaults();

    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.loadUsers(this.pagination.currentPage, this.pagination.itemsPerPage);

  }

  loadUsers(page: number, pageSize: number) {
    return this.userService.getUsers(page, this.pageSize, this.userParams).subscribe((users: PaginatedResult<User[]>) => {
      console.log(users);
      this.users = users.result;
      this.pagination.currentPage = users.pagination.currentPage;
      this.pagination.totalItems = users.pagination.totalItems;
      this.pagination.totalPages = users.pagination.totalPages;
      this.pagination.itemsPerPage = users.pagination.itemsPerPage;
    }, error => {
      this.alertify.error(error);
    });
  }

  resetFilters() {
    this.setParamDefaults();

    this.loadUsers(1, this.pageSize);
  }

  setParamDefaults() {

     // Init Params Here
     this.userParams.gender = (this.user.gender === 'male') ? 'female' : 'male';
     this.userParams.minAge = 18;
     this.userParams.maxAge = 99;
  }

  pageChanged(event: any): void {
   this.loadUsers(event.page, this.pageSize);
  }

}
