import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from 'src/_services/auth.service';
import { AlertifyService } from 'src/_services/Alertify.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(private authService: AuthService, private router: Router, private alertifyService: AlertifyService) { }

  canActivate():  boolean {

  if (this.authService.loggedIn()) {
  return true;
  }

  this.alertifyService.error('You are not authorized to access this page, please log in');
  this.router.navigate(['/home']);
  return false;
  }
}
