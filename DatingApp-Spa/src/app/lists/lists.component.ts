import { Component, OnInit } from '@angular/core';
import { User } from 'src/_models/User';
import { Pagination, PaginatedResult } from 'src/_models/pagination';
import { AuthService } from 'src/_services/auth.service';
import { UserServiceService } from 'src/_services/UserService.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(private authService: AuthService, private userService: UserServiceService, private alertifyService: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data => {
      console.log(data);
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.likesParam = 'Likers';
  }

  loadUsers(like: string) {


    this.likesParam = like;

    console.log(this.likesParam);

    return this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage,
       null, this.likesParam).subscribe((users: PaginatedResult<User[]>) => {
      console.log(users);
      this.users = users.result;
      this.pagination.currentPage = users.pagination.currentPage;
      this.pagination.totalItems = users.pagination.totalItems;
      this.pagination.totalPages = users.pagination.totalPages;
      this.pagination.itemsPerPage = users.pagination.itemsPerPage;
    }, error => {
      this.alertifyService.error(error.error);
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers(this.likesParam);
   }

}
