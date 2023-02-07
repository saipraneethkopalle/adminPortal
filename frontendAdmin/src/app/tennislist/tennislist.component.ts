import { Component, OnInit } from '@angular/core';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-tennislist',
  templateUrl: './tennislist.component.html',
  styleUrls: ['./tennislist.component.css']
})
export class TennislistComponent implements OnInit {
  matchesData:any;
  totalEvents:any;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.getCmptlist()
    this.eventCount()
    }
  eventCount(){
    this.apiService.getEventsCount(2).subscribe((res:any)=>{
      this.totalEvents = res.result.length;
    })
  }
  getCmptlist(){
    this.apiService.getCmpt(2).subscribe((res:any)=>{
      this.matchesData = res.result;
    });
  }

}
