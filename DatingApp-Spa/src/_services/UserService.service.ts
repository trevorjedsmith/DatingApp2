import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/_models/User';
import { PaginatedResult } from 'src/_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from 'src/_models/Message';

// const httpOptions = {
//  headers: new HttpHeaders({
//    'Authorization': 'Bearer ' + localStorage.getItem('token')
//  })
// };

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  baseUrl = environment.baseUrl;

constructor(private http: HttpClient) { }

getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
  const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
  let paramUrl = `${this.baseUrl}users`;

  if (page != null && itemsPerPage != null) {
    paramUrl += `?pageSize=${itemsPerPage}&pageNumber=${page}`;
  } else {
    const tempPage = 1;
    const tempPageSize = 5;
    paramUrl += `?pageSize=${tempPageSize}&pageNumber=${tempPage}`;
  }

  if (userParams != null) {
    paramUrl += `&minAge=${userParams.minAge}&maxAge=${userParams.maxAge}&gender=${userParams.gender}`;
  }

  if (likesParam === 'Likers') {
    paramUrl += `&likers=true`;
  }

  if (likesParam === 'Likees') {
    paramUrl += `&likees=true`;
  }

  return this.http.get<User[]>(paramUrl , { observe : 'response'} )
  .pipe(map(response => {
    paginatedResult.result = response.body;
    if (response.headers.get('Pagination') != null) {
      paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
    }
    return paginatedResult;
  }));
}

getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
  const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

  let params = new HttpParams();

  params = params.append('MessageContainer', messageContainer);

  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
}

getUser(id: number): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'users/' + id, user);
}

setMainPhoto(userId: number, id: number) {
  const param = {};
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', param);
}

deletePhoto(userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}

sendLike(id: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
}

}
