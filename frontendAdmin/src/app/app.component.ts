import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminApiServiceService } from './services/admin-api-service.service';
// import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontendAdmin';
  isAuthenticated:boolean=false;
  // bnIdle: any;
  authListenerSubs:Subscription=new Subscription();
  constructor(private router:Router,private apiService:AdminApiServiceService) {
  }
  ngOnInit(): void {
    this.apiService.autoAuthUser();
    this.isAuthenticated = this.apiService.getIsAuth();

    this.authListenerSubs = this.apiService
    .getAuthStatusListner()
    .subscribe((IsAuthenticated) => {
        this.isAuthenticated = IsAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
