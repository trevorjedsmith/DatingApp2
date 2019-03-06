import { Component, OnInit } from '@angular/core';
import { Message } from 'src/_models/Message';
import { Pagination, PaginatedResult } from 'src/_models/pagination';
import { UserServiceService } from 'src/_services/UserService.service';
import { AuthService } from 'src/_services/auth.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  messageContainer = 'Unread';
  pagination: Pagination;

  constructor(private userService: UserServiceService, private authService: AuthService, private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data => {
      console.log(data);
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });

  }

  loadMessages(type: string) {

    this.messageContainer = type;

    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((res: PaginatedResult<Message[]>) => {
        console.log(res);
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  // deleteMessage(id: number) {
  //   this.alertify.confirm('Are you sure you want to delete this message?', () => {
  //     this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
  //       this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
  //       this.alertify.success('Message has been deleted');
  //     }, error => {
  //       this.alertify.error('Failed to delete the message');
  //     });
  //   });
  // }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages(this.messageContainer);
  }

}
