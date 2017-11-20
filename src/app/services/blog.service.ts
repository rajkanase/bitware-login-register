import { Injectable } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { AuthService } from './auth.service';


@Injectable()
export class BlogService {

  options;
  domain=this.authService.domain;

  constructor(
    private authService:AuthService,
    private http:Http
    
  ) { }

  createAuthenticationHeaders(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/api/newBlog', blog, this.options).map(res=>res.json());
  }

  getAllBlogs(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/allBlogs',this.options).map(res=>res.json());
  }

  getSingleBlog(id){
    this.createAuthenticationHeaders();
        return this.http.get(this.domain + '/api/singleBlog/'+ id,this.options).map(res=>res.json());    
  }
  
  editBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/api/updateBlog',blog,this.options).map(res=>res.json());
  }

  deleteBlog(id){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + '/api/deleteBlog/' + id,this.options).map(res=>res.json());
  }

  likeBlog(id){
    const blogData = {id:id};
    return this.http.put(this.domain + '/api/likeBlog',blogData,this.options).map(res=>res.json());
  }

  dislikeBlog(id){
    const blogData = {id:id};
    return this.http.put(this.domain + '/api/dislikeBlog',blogData,this.options).map(res=>res.json());
  }

}
