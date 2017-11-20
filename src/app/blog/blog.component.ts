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
  newComment =[];
  commentForm;
  enabledComments = [];
  

  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private authService:AuthService,
    private blogService:BlogService
  ) { 
    this.createNewBlogForm();
    this.createCommentForm();
    
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{
      this.username=profile.user.username;
    })
    
    this.getAllBlogs();
  }



  createNewBlogForm(){
    
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

draftComment(id){
  this.commentForm.reset();
  this.newComment=[];
  this.newComment.push(id);
}

createCommentForm(){
  this.commentForm = this.formBuilder.group({
    comment:['',Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(200)
    ])]
  });
}

cancelSubmission(id){
  const index =this.newComment.indexOf(id);
  this.newComment.splice(index,1);
  this.commentForm.reset();
  this.processing=false;
}

postComment(id){
  this.processing=true;
  const comment = this.commentForm.get('comment').value();
  this.blogService.postComment(id,comment).subscribe(data=>{
    this.getAllBlogs();
    const index =this.newComment.indexOf(id);
    this.newComment.splice(index,1);
    this.commentForm.reset();
    this.processing=false;
    if(this.enabledComments.indexOf(id) < 0){
      this.expand(id);
    }
  });
}

expand(id){
  this.enabledComments.push(id);
}

collapse(id){
  const index =this.enabledComments.indexOf(id);
  this.enabledComments.splice(index,1);
}



}
