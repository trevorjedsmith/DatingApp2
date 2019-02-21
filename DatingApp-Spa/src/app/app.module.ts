// Angular Module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Custom Modules
import { BsDropdownModule, TabsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { JwtModule } from '@auth0/angular-jwt';

// Components
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './member-card/member-card.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberEditResolver } from 'src/_services/member-edit.resolver';
import { PreventUnsavedChanges } from 'src/_guards/prevent-unsave-changes.guards';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';

// Services
import { AuthGuard } from 'src/_guards/auth.guard';
import { UserServiceService } from 'src/_services/UserService.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { AuthService } from 'src/_services/auth.service';

// Routes
import { appRoutes } from './routes';

export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      NgxGalleryModule,
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      TabsModule.forRoot(),
      ReactiveFormsModule,
      FileUploadModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']

         }
      })
   ],
   providers: [
      AuthService,
      AlertifyService,
      AuthGuard,
      UserServiceService,
      MemberEditResolver,
      PreventUnsavedChanges
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
