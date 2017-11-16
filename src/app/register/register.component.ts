import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form:FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  usernameValid;
  emailMessage;
  usernameMessage;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router
  ) {
    this.createForm();
   }


  createForm(){
    this.form=this.formBuilder.group({
      email:['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validEmail
      ])],
      username:['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validUsername
      ])],
      mobile:['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        this.validMobile
      ])],
      password:['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validPassword
      ])],
      confirm:['', Validators.required]
    },{validator:this.matchingPasswords('password','confirm')})
  }


  validEmail(controls){
    const regExp=new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { validEmail:true}
    }
  }

  validUsername(controls){
    const regExp=new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { validUsername:true}
    }
  }


  validMobile(controls){
    const regExp=new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { validMobile:true}
    }
  }

  validPassword(controls){
    const regExp=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { validPassword:true}
    }
  }

  matchingPasswords(password,confirm){
    return (group: FormGroup)=>{
      if(group.controls[password].value === group.controls[confirm].value){
        return null;
      }else{
        return {matchingPasswords:true}
      }
    }
  }

  onRegisterSubmit(){
    this.processing=true;
    const user={
      email: this.form.get('email').value,
      username:this.form.get('username').value,
      mobile:this.form.get('mobile').value,
      password:this.form.get('password').value
    }
    this.authService.registerUser(user).subscribe(data=>{
      if(!data.success){
        this.messageClass='alert alert-danger';
        this.message=data.message;
        this.processing=false;
      }else{
        this.messageClass='alert alert-success';
        this.message=data.message;
        setTimeout(()=>{
          this.router.navigate(['/login']);
        })
        
      }
    })
   
  }

  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
      console.log(data);
      
      if(!data.success){
        this.emailValid=false;
        this.emailMessage=data.message;
      }else{
        this.emailValid=true;
        this.emailMessage=data.message;        
      }
    });
  }

  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
      console.log("hi");
      
      if(!data.success){
        this.usernameValid=false;
        this.usernameMessage=data.message;
      }else{
        this.usernameValid=true;
        this.usernameMessage=data.message;
      }
    });
  }


  ngOnInit() {
  }

}
