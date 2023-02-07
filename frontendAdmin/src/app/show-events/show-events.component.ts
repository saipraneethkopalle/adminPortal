import { Component, OnInit } from '@angular/core';
import { AdminApiServiceService } from '../services/admin-api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-events',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {
  eventData:any;
  sportName:any;
  eventId:any
  constructor(private apiService:AdminApiServiceService,private router:Router) { }

  ngOnInit(): void {
    this.sportName = localStorage.getItem("sportName");
    this.getEventById(localStorage.getItem("competitionId"))
  }
  getEventById(id:any){
    this.apiService.getEventsById(id).subscribe((res:any)=>{
      this.eventData = res.result;
    })
  }
  redirect(eid:any,ename:any) {
    localStorage.setItem('eventName',ename)
    this.router.navigate(['/listmarket',eid])
  }
}
