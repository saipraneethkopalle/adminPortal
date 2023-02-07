import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminApiServiceService } from '../services/admin-api-service.service';
// import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit,OnDestroy {
  isAuthenticated:boolean=false;
  level:any;
  userName:any;
  adminLevel:any;
  authListenerSubs: Subscription=new Subscription();
  constructor(private router:Router,private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.apiService.getIsAuth();
    if(!this.isAuthenticated){
      this.checkLogin();
    }
    this.level = this.apiService.getUserLevel();
    this.userName = this.apiService.getUserName();
    if(this.level == '1') {
      this.adminLevel = true;
    }
    else {
      this.adminLevel = false;
    }

    this.authListenerSubs = this.apiService.getAuthStatusListner().subscribe((IsAuthenticated) => {
      console.log("isAuthenticated",IsAuthenticated);
        this.isAuthenticated = IsAuthenticated;
        this.level = this.apiService.getUserLevel();
        this.userName = this.apiService.getUserName();
        if(this.level == '1') {
           this.adminLevel = true;
        }
        else {
           this.adminLevel = false;
        }
    });
  }

  logout() {
    this.apiService.logout();
  }
  checkLogin(){
    this.router.navigate(['/'])
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
