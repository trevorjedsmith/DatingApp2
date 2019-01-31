import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/_services/auth.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  loggedOn = false;
  constructor(public authService: AuthService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
    }


  login() {
    this.authService.login(this.model).subscribe(response => {
      this.alertifyService.success('Logged in successfully..');
      this.router.navigate(['/members']);
    }, error => {

      const message = `StatusCode: ${error.status}, Message: ${error.error}`;
      this.alertifyService.error(message);
    });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertifyService.message('Logged out');
    this.router.navigate(['/home']);
  }

}
