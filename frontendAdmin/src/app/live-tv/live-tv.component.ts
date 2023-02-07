import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-live-tv',
  templateUrl: './live-tv.component.html',
  styleUrls: ['./live-tv.component.css']
})
export class LiveTvComponent implements OnInit {
  currentUrl:any;
  constructor(private apiService:AdminApiServiceService) { }
  matchesList:any;
  ngOnInit(): void {
    this.getMatches();
  }
  getMatches() {
    this.apiService.getEvents().subscribe((res:any)=>{
      if(res) {
        this.matchesList = res;
      }
    });

  }
  setUrl(data:any){
    this.currentUrl = data.target.value;
    // console.log("url",this.currentUrl);
  }
  updateUrlData(data:any){
    let payload = {"eventId":data.eventId,"channelNo":this.currentUrl}
    // console.log(payload);
    this.apiService.updateUrl(payload).subscribe((res:any)=>{
      // console.log(res);
      Swal.fire({
        icon: 'success',
        title: "Set Url Value updated successfully",
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
}
