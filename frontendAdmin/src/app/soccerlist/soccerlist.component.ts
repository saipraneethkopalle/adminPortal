import { Component, OnInit } from '@angular/core';
import { AdminApiServiceService } from '../services/admin-api-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-soccerlist',
  templateUrl: './soccerlist.component.html',
  styleUrls: ['./soccerlist.component.css']
})
export class SoccerlistComponent implements OnInit {
  matchesData:any;
  totalEvents:any;
  constructor(private apiService:AdminApiServiceService,private router:Router) { }

  ngOnInit(): void {
    this.getCmptlist()
    this.eventCount()
    }
  eventCount(){
    this.apiService.getEventsCount(1).subscribe((res:any)=>{
      this.totalEvents = res.result.length;
    })
  }
  getCmptlist(){
    this.apiService.getCmpt(1).subscribe((res:any)=>{
      this.matchesData = res.result;
    });
  }
  showEvents(item:any){
    localStorage.setItem("sportName","Soccer");
    this.router.navigate(["/showEvents/"+item.competition_id])
  }
}
