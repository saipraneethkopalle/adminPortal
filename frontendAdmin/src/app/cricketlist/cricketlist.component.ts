import { Component, OnInit } from '@angular/core';
import { AdminApiServiceService } from '../services/admin-api-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cricketlist',
  templateUrl: './cricketlist.component.html',
  styleUrls: ['./cricketlist.component.css']
})
export class CricketlistComponent implements OnInit {
  matchesData:any;
  totalEvents:any;
  constructor(private apiService:AdminApiServiceService,private router:Router) { }

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
  showEvents(item:any){
    localStorage.setItem("sportName","Cricket");
    localStorage.setItem("competitionId",item.competition_id);
    this.router.navigate(["/showEvents/"+item.competition_id])
  }
}
