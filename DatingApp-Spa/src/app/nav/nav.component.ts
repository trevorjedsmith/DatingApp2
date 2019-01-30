import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/_services/auth.service';
import { AlertifyService } from 'src/_services/Alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  loggedOn = false;
  constructor(private authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
    }


  login() {
    this.authService.login(this.model).subscribe(response => {
      this.alertifyService.success('Logged in successfully..');
    }, error => {

      const message = `StatusCode: ${error.status}, Message: ${error.error}`;
      this.alertifyService.error(message);
    });
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout() {
    localStorage.removeItem('token');
    this.alertifyService.message('Logged out');
  }

}
