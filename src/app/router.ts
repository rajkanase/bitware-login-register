import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";


const routes: Routes = [
    { path: '', redirectTo:'/home', pathMatch:'full' },
    { path: 'home', component: HomeComponent },
    { path: 'dash', component: DashboardComponent },
    { path: 'register', component: RegisterComponent }

  ];

  export const MyRoutingModule = RouterModule.forRoot(routes);
  