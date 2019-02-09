import { Component, OnInit, Input } from '@angular/core';
import { Photo } from 'src/_models/Photos';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment' ;
import { AuthService } from 'src/_services/auth.service';
import { repeat } from 'rxjs/operators';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];

  public uploader: FileUploader; // = new FileUploader({url: URL});
  public hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl;

  constructor(private authService: AuthService) { }

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

      if(response) {
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
      }
    };
  }

}
