import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form;
  message;
  messageClass;
  processing = false;
  previousUrl;

  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private authService:AuthService,
    private authGuard:AuthGuard
  ) { 
    this.createForm();
  }

  createForm(){
    this.form=this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]
    });
  }

  onLoginSubmit(){
    this.processing=true;
    const user={
      username:this.form.get('username').value,
      password:this.form.get('password').value
    }
    this.authService.login(user).subscribe(data=>{
      if(!data.success){
        this.messageClass='alert alert-danger';
        this.message=data.message;
        this.processing=false;
      }else{
        this.messageClass='alert alert-success';
        this.message=data.message;
        this.authService.storeUserData(data.token,data.user);
        setTimeout(()=>{

          if(this.previousUrl){
            this.router.navigate([this.previousUrl]);
          }else{
          this.router.navigate(['/dash']);
          }
        }, 2000);
        
      }
    })
  }

  ngOnInit() {
    if(this.authGuard.redirectedUrl){
      this.messageClass='alert alert-danger';
      this.message='You must logged in to view this page';
      this.previousUrl=this.authGuard.redirectedUrl;
      this.authGuard.redirectedUrl=undefined;
    }
  }

}
