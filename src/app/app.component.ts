import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(
    public authService:AuthService,
    private router:Router,
    private flashMessagesService:FlashMessagesService
  ){

  }

  onLogout(){
    // console.log("in out");
    
    this.authService.logout();
    this.flashMessagesService.show('You are logged out.', {cssClass: 'alert-info'});
    this.router.navigate(['/home']);
  }
}
