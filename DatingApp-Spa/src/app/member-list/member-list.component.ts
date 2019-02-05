import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/_services/UserService.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { User } from 'src/_models/User';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];

  constructor(private userService: UserServiceService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    return this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      this.alertify.error(error);
    });
  }

}
