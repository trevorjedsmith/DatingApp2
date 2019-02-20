import { Component, OnInit } from '@angular/core';
import { User } from 'src/_models/User';
import { UserServiceService } from 'src/_services/UserService.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserServiceService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          imagePercent: 100,
          preview: false
      }
   ];

    this.galleryImages = [];

    this.userService.getUser(+this.route.snapshot.params['id'])
    .subscribe((user: User) => {
      this.user = user;




    for (let i = 0; i < this.user.photos.length; i++) {
      this.galleryImages.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url
      });
    }
    }, error => {
      this.alertify.error(error);
    });

  }

}
