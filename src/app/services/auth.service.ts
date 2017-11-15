import { Injectable } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  domain="http://localhost:3000";

  constructor(
    private http:Http
  ) { }

  registerUser(user){
    return this.http.post(this.domain + '/api/register',user).map(res=>res.json());
  }

}
