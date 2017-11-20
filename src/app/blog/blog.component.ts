import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BlogService } from '../services/blog.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  newPost=false;
  form:FormGroup;
  processing=false;
  username;
  messageClass;
  message;
  blogPosts;
  

  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private authService:AuthService,
    private blogService:BlogService
  ) { 
    this.createNewBlogForm();
    
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{
      this.username=profile.user.username;
    })
    
    this.getAllBlogs();
  }



  createNewBlogForm(){
    console.log('here');
    
    this.form=this.formBuilder.group({
      title:['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        this.alphaNumericValidations
      ])],
      body:['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ])]
    })
  }

  alphaNumericValidations(controls){
    const regExp=new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { alphaNumericValidations:true}
    }
  }

  goBack(){
    window.location.reload();
  }


  newBlogForm(){
    this.newPost=true;
  }

  onBlogSubmit(){
    this.processing=true;
    const blog ={
      title:this.form.get('title').value,
      body:this.form.get('body').value,
      createdBy:this.username
    }
    this.blogService.newBlog(blog).subscribe(data=>{
      if(!data.success){
        this.messageClass='alert alert-danger';
        this.message=data.message;
        this.processing=false;
      }else{
        this.messageClass='alert alert-success';
        this.message=data.message;
        this.getAllBlogs();
        setTimeout(()=>{
          this.newPost=false;
          this.processing=true;
          this.message=false;
          this.form.reset();
        }, 2000);
      }
    });
  }


getAllBlogs(){
  this.blogService.getAllBlogs().subscribe(data=>{
      this.blogPosts=data.message;
  })
}

reloadBlogs(){
  window.location.reload();
}

likeBlog(id){
  this.blogService.likeBlog(id).subscribe(data=>{
    this.getAllBlogs();
  });
}

dislikeBlog(id){
  this.blogService.dislikeBlog(id).subscribe(data=>{
    this.getAllBlogs();
  });
}




}
