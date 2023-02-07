// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminApiServiceService } from '../services/admin-api-service.service';
@Component({
  selector: 'app-showactivities',
  templateUrl: './showactivities.component.html',
  styleUrls: ['./showactivities.component.css']
})
export class ShowactivitiesComponent implements OnInit,OnDestroy {

  matchActivities: any;
  // isLoading = false;
  id: any;
  prov:any
  level = '0';
  type: any = '';
  // private activitiesSub!: Subscription;
  constructor( private route: ActivatedRoute, private mainService:AdminApiServiceService ) { }

  ngOnInit() {
    // this.isLoading = true;
    // this.level = this.userService.getUserLevel();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.mainService.getMatchActivities(this.id, this.type).subscribe((res:any)=>{
        this.matchActivities = res;
        });
        // this.activitiesSub = this.matchService.getUpdateMatchActivitiesListner()
        //   .subscribe((response) => {
        //     this.isLoading = false;
        //     //console.log(response);
        //     this.matchActivities = response.matchActivities;
        //     //console.log(this.matchActivities);
        //   },
        //     error => {
        //       console.log(error);
        //     });
      }
    });
  }

  setFilter(type:any) {
    // console.log("the type is ",type.value)
    this.type = type.target.value;
    // this.isLoading = true;
    this.mainService.getMatchActivities(this.id,this.type).subscribe((res:any)=>{
      console.log("printing the res",this.id)
      this.matchActivities = res;
      
     
    })
    // this.matchService.getMatchActivities(this.id, this.type);
  }

  ngOnDestroy() {
    // this.activitiesSub.unsubscribe();
  }

}
