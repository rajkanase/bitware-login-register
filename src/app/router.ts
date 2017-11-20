import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from './guards/notAuth.guard';
import { BlogComponent } from "./blog/blog.component";
import { EditBlogComponent } from "./edit-blog/edit-blog.component";


const routes: Routes = [
    { path: '', redirectTo:'/home', pathMatch:'full' },
    { path: 'home', component: HomeComponent },
    { path: 'dash', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard]},
    { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard]},
    { path : 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'blog', component: BlogComponent, canActivate: [AuthGuard]},
    {path : 'edit-blog/:id', component: EditBlogComponent, canActivate: [AuthGuard]}
    

  ];

  export const MyRoutingModule = RouterModule.forRoot(routes);
  