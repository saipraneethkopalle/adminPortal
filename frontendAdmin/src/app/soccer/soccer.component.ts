import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-soccer',
  templateUrl: './soccer.component.html',
  styleUrls: ['./soccer.component.css']
})
export class SoccerComponent implements OnInit {
  matchesData:any;
  sports:any;
  changedValue:any;
  level:any;
  constructor(private apiService:AdminApiServiceService,private router:Router) { }

  ngOnInit(): void {
    this.getEventBySports();
    this.level = this.apiService.getUserLevel();
  }
  getEventBySports() {
    this.sports = {isActive:true, isResult:false, sportId:'1'};
    this.apiService.getEventsBySports(this.sports).subscribe((res: any) => {

      this.matchesData = res;
    });
  }
  deleteMatch(data:any){
    let payload = {
      "event_id":data['eventId']
    }
    this.matchesData =this.matchesData.filter((md:any)=>{if(md['eventId'] != payload['event_id']) return md;})
    this.apiService.deleteMatchByEId(payload).subscribe((res:any)=>{
      // console.log("deleted successfully",res);
      Swal.fire({
        icon: 'success',
        title: "Event Deleted successfully",
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
  changeOdds(data:any,current:any){
    this.changedValue = current.target.value;
    // console.log(this.changedValue);
}
updateProvider(data:any){
  let payload = {
    "eventId":data.eventId,
    "oddsProvider":this.changedValue
  }
  // console.log(payload);
  this.apiService.updateProvider(payload).subscribe((res:any)=>{
      // console.log("updated successfully",res);
      Swal.fire({
        icon: 'success',
        title: "Odds Value updated successfully",
        showConfirmButton: false,
        timer: 1500
      })
  })
}

removeMatch(item:any) {

  let data = {
    "eventId": item.eventId,
    "Sport": item.sportName
  }
  let value  = {
    isActive:false
  }
  // this.matchesData =this.matchesData.filter((md:any)=>{if(md['Event Id'] != data['Event Id']) return md;})
  this.apiService.removeMatchBySports(data,value).subscribe((res)=>{
    // console.log(res);
    if(res) {
      this.getEventBySports();
      Swal.fire({
        icon: 'success',
        title: "Event Removed successfully",
        showConfirmButton: false,
        timer: 1500
      })
    }
  })

}
redirect(eventId:any) {
  this.router.navigate([`fancy/${eventId}`])

}
showActivity(eventId:any){
  this.router.navigate([`match-activities/${eventId}`])
}
gosetlimit(marketId:any) {
  this.router.navigate([`setlimit/${marketId}`])
  }

}
