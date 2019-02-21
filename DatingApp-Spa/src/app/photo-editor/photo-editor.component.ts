import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Photo } from 'src/_models/Photos';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment' ;
import { AuthService } from 'src/_services/auth.service';
import { repeat } from 'rxjs/operators';
import { UserServiceService } from 'src/_services/UserService.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { User } from 'src/_models/User';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  public uploader: FileUploader; // = new FileUploader({url: URL});
  public hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl;
  currentMain: Photo;

  constructor(private authService: AuthService, private userService: UserServiceService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) =>  {

      if (response) {
        const resp: Photo =  JSON.parse(response);

        const photo = {
            id: resp.id,
            url: resp.url,
            dateAdded: resp.dateAdded,
            description: resp.description,
            isMain: resp.isMain,
            isApproved: resp.isApproved
        };

        this.photos.push(photo);
        if (photo.isMain) {
          this.getMemberPhotoChange.emit(photo.url);
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe((user: User) => {
    this.currentMain = this.photos.filter(p => p.isMain === true)[0];
    this.currentMain.isMain = false;
    photo.isMain = true;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.authService.currentUser = user;
    }
    this.getMemberPhotoChange.emit(photo.url);
    }, error => {
    this.alertify.error(error);
    });
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the photo!');
      });
    });
  }
}
