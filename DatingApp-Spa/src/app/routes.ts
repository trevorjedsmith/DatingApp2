import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from 'src/_guards/auth.guard';
import { MemberDetailComponent } from './member-detail/member-detail.component';

export const appRoutes: Routes = [
{path: 'home', component: HomeComponent},
{path: 'members', component: MemberListComponent, canActivate: [AuthGuard]},
{path: 'members/:id', component: MemberDetailComponent, canActivate: [AuthGuard]},
{path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
{path: 'lists', component: ListsComponent, canActivate: [AuthGuard]},
{path: '**', redirectTo: 'home', pathMatch: 'full'}
];
