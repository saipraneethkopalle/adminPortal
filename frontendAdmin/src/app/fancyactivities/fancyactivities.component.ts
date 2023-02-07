import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-fancyactivities',
  templateUrl: './fancyactivities.component.html',
  styleUrls: ['./fancyactivities.component.css']
})
export class FancyactivitiesComponent implements OnInit {
  fancyActivities:any;
  eventId: any;
  selectionId:any;
  activitiesSub:Subscription | undefined;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    var str = window.location.href;
    var n = str.lastIndexOf('/');
    this.selectionId = str.substring(n + 1);
    var m = str.substring(n,-this.selectionId.length);
    var ev = m.lastIndexOf('/');
    this.eventId = m.substring(ev).replace('/','');
    this.getActivities();
  }
  getActivities(){
    this.apiService.getFancyActivities(this.eventId, this.selectionId);
        this.activitiesSub = this.apiService.getUpdateFancyActivitiesListner()
        .subscribe((response) => {
          this.fancyActivities = response.fancyActivities;
        },
        error => {
          console.log(error);
        });
  }

}
