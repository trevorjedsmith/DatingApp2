import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from 'src/_guards/auth.guard';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberEditResolver } from 'src/_services/member-edit.resolver';
import { PreventUnsavedChanges } from 'src/_guards/prevent-unsave-changes.guards';
import { ListsResolver } from 'src/_resolvers/ListResolver';

export const appRoutes: Routes = [
{path: 'home', component: HomeComponent},
{path: 'members', component: MemberListComponent, canActivate: [AuthGuard]},
{path: 'members/:id', component: MemberDetailComponent, canActivate: [AuthGuard]},
{path: 'member/edit', component: MemberEditComponent, canActivate: [AuthGuard],
 resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges]},
{path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
{path: 'lists', component: ListsComponent, canActivate: [AuthGuard], resolve: {users: ListsResolver}},
{path: '**', redirectTo: 'home', pathMatch: 'full'}
];
