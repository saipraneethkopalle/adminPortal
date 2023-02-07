import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  level:any;
  matchList:any;
  sports:any;
  changedValue:any;
  eventId: any;
  eventName: any;
  btn:any;
  process:any;
  createdBy:any;
  constructor(private apiService:AdminApiServiceService,private router:Router) { }

  ngOnInit(): void {
    this.getMatchBySports();
    this.level = this.apiService.getUserLevel();
    this.createdBy = this.apiService.getUserName();
  }
  getMatchBySports(){
    this.sports = {isActive:true, isResult:false, sportId:'4'};
    this.apiService.getEventsBySports(this.sports).subscribe((res:any)=>{
      this.matchList = res;
      // console.log(this.matchList);
    })
  }
  changeOdds(data:any,current:any){
      this.changedValue = current.target.value;
      console.log(this.changedValue);
  }
  updateProvider(data:any){
    let payload = {
      "eventId":data.eventId,
      "oddsProvider":this.changedValue,
      "createdBy":this.createdBy
    }

    console.log("odds payload",payload);
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
  updateProvider2(data:any){
    let payload = {
      "eventId":data.eventId,
      "fancyProvider":this.changedValue,
      "createdBy":this.createdBy
    }
    // console.log(payload);
    this.apiService.updateProvider(payload).subscribe((res:any)=>{
        // console.log("updated successfully",res);
        Swal.fire({
          icon: 'success',
          title: "Fancy Value updated successfully",
          showConfirmButton: false,
          timer: 1500
        })
    })
  }
  updateProvider3(data:any){
    let payload = {
      "eventId":data.eventId,
      "bmProvider":this.changedValue,
      "createdBy":this.createdBy
    }
    console.log(payload);
    this.apiService.updateProvider(payload).subscribe((res:any)=>{
        // console.log("updated successfully",res);
        Swal.fire({
          icon: 'success',
          title: "BookMaker Value updated successfully",
          showConfirmButton: false,
          timer: 1500
        })
    })
  }
  updateProvider4(data:any){
    let payload = {
      "eventId":data.eventId,
      "fancyAType":this.changedValue,
      "createdBy":this.createdBy
    }
    console.log(payload);
    this.apiService.updateProvider(payload).subscribe((res:any)=>{
        // console.log("updated successfully",res);
        Swal.fire({
          icon: 'success',
          title: "Active Value updated successfully",
          showConfirmButton: false,
          timer: 1500
        })
    })
  }
  updateProvider5(data:any){
    let payload = {
      "eventId":data.eventId,
      "addType":this.changedValue,
      "createdBy":this.createdBy
    }
    console.log(payload);
    this.apiService.updateProvider(payload).subscribe((res:any)=>{
        // console.log("updated successfully",res);
        Swal.fire({
          icon: 'success',
          title: "Event Type Value updated successfully",
          showConfirmButton: false,
          timer: 1500
        })
    })
  }
  deleteMatch(data:any){
    let payload = {
      "event_id":data.eventId
    }
    this.matchList =this.matchList.filter((md:any)=>{if(md.eventId != payload['event_id']) return md;})
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

  removeMatch(item:any) {
    // console.log(item);
    let data = {
      "eventId": item.eventId,
      "Sport": item.sportName
    }
    let value  = {
      isActive:false
    }
    // this.matchList =this.matchList.filter((md:any)=>{if(md['Event Id'] != data['Event Id']) return md;})
    this.apiService.removeMatchBySports(data,value).subscribe((res)=>{
      // console.log(res);
      if(res) {
        this.getMatchBySports();
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
  gosetlimit(marketId:any) {
    this.router.navigate([`setlimit/${marketId}`])
  }

  setData(eventId:any,eventName:any){
    this.eventId = eventId,
    this.eventName = eventName
  };

  removeData(){
    this.eventId = '',
    this.eventName = ''
  }

  updateHeaders(){

    let header = (<HTMLInputElement>document.getElementById('hname')).value;
    let team1 = (<HTMLInputElement>document.getElementById('team1')).value;
    let team2 = (<HTMLInputElement>document.getElementById('team2')).value;
    let team3 = (<HTMLInputElement>document.getElementById('team3')).value;

    let data = {evenid: this.eventId, header, team1, team2, team3};
    this.apiService.updateHeader(data).subscribe((res:any)=>{
      let btn = (<HTMLInputElement>document.getElementById('hbtn')).style.display ='none';
      let process = (<HTMLInputElement>document.getElementById('hprocess')).style.display ='block';
      (<HTMLInputElement>document.getElementById('hname')).value = '';
      (<HTMLInputElement>document.getElementById('team1')).value = '';
      (<HTMLInputElement>document.getElementById('team2')).value = '';
      (<HTMLInputElement>document.getElementById('team3')).value = '';
      this.msgSuccess();
      // console.log(res);
      if(res.status != 200){
        Swal.fire({
          icon: 'error',
          title: "Site can't be reached",
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  msgSuccess(){
    Swal.fire({
      icon: 'success',
      title: 'Successfully Updated!',
      showConfirmButton: false,
      timer: 1500
    })
  }

  msgFailure(){
    Swal.fire({
      icon: 'error',
      title: 'Somthing went wrong',
      showConfirmButton: false,
      timer: 1500
    })
  }
}

