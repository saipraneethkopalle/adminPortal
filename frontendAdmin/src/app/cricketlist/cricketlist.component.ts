import { Component, OnInit } from '@angular/core';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-cricketlist',
  templateUrl: './cricketlist.component.html',
  styleUrls: ['./cricketlist.component.css']
})
export class CricketlistComponent implements OnInit {
  matchesData:any;
  totalEvents:any;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.getCmptlist()
    this.eventCount()
    }
  eventCount(){
    this.apiService.getEventsCount(4).subscribe((res:any)=>{
      this.totalEvents = res.result.length;
    })
  }
  getCmptlist(){
    this.apiService.getCmpt(4).subscribe((res:any)=>{
      this.matchesData = res.result;
    });
  }

}
