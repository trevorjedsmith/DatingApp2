import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/_models/User';
import { AuthService } from 'src/_services/auth.service';
import { UserServiceService } from 'src/_services/UserService.service';
import { AlertifyService } from 'src/_services/Alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user: User;

  constructor(private authService: AuthService, private userService: UserServiceService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }
  sendLike(recipientId: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, recipientId)
    .subscribe(data => {
      this.alertifyService.success(`You have liked ${this.user.knownAs}`);
    }, error => {
      console.log(error);
    this.alertifyService.error(error.error);
    });
  }
}
