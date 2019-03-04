import { Injectable } from '@angular/core';
import { User } from 'src/_models/User';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserServiceService } from '../_services/UserService.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/Alertify.service';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ListsResolver implements Resolve<User[]> {

    pageNumber = 1;
    pageSize = 5;
    likesParam = 'Likers';

    constructor(private userService: UserServiceService, private authService: AuthService
        , private router: Router, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParam)
        .pipe(catchError(error => {
            this.alertify.error('Problem retrieving your data');
            this.router.navigate(['/home']);
            return of(null);
        }));
    }

}
