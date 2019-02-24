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
  pagination: Pagination;
  pageSize = 5;

  constructor(private userService: UserServiceService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers(1, this.pageSize);
  }

  loadUsers(page: number, pageSize: number) {
    return this.userService.getUsers(page, this.pageSize).subscribe((users: PaginatedResult<User[]>) => {
      this.users = users.result;
      this.pagination = users.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

  pageChanged(event: any): void {
   this.loadUsers(event.page, this.pageSize);
  }

}
