import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/_models/User';
import { AlertifyService } from 'src/_services/Alertify.service';
import { NgForm } from '@angular/forms';
import { UserServiceService } from 'src/_services/UserService.service';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  user: User;

  @ViewChild('editForm') editForm: NgForm;

  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
    private userService: UserServiceService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      console.log(this.user);
    });
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user)
    .subscribe(next => {
      this.alertify.success(`Your profile has been successfully updated`);
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error.error);
    });
 }

 updateMainPhoto(photoUrl: string) {
   this.user.photoUrl = photoUrl;
 }

}
