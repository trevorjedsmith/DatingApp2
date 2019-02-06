import { Injectable } from '@angular/core';
import { User } from 'src/_models/User';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserServiceService } from './UserService.service';
import { AuthService } from './auth.service';
import { AlertifyService } from './Alertify.service';
import { catchError } from 'rxjs/operators';


@Injectable()
export class MemberEditResolver implements Resolve<User> {

    constructor(private userService: UserServiceService, private authService: AuthService
        , private router: Router, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.userService.getUser(this.authService.decodedToken.nameid)
        .pipe(catchError(error => {
            this.alertify.error('Problem retrieving your data');
            this.router.navigate(['/member/edit']);
            return of(null);
        }));
    }

}