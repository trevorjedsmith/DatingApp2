import { Injectable } from '@angular/core';
import { User } from 'src/_models/User';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserServiceService } from '../_services/UserService.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/Alertify.service';
import { catchError } from 'rxjs/operators';
import { Message } from 'src/_models/Message';


@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

    pageNumber = 1;
    pageSize = 5;
    messages: Message[];
    messageContainer = 'Unread';

    constructor(private userService: UserServiceService, private authService: AuthService
        , private router: Router, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid , this.pageNumber, this.pageSize, this.messageContainer)
        .pipe(catchError(error => {
            this.alertify.error('Problem retrieving your messages');
            this.router.navigate(['/home']);
            return of(null);
        }));
    }

}
