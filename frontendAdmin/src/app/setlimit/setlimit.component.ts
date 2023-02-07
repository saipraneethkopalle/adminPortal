import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';


@Component({
  selector: 'app-setlimit',
  templateUrl: './setlimit.component.html',
  styleUrls: ['./setlimit.component.css']
})
export class SetlimitComponent implements OnInit {
  weblist:any;
  result:any;
  payload:any;
  setLimit:any;
  constructor(private apiService:AdminApiServiceService) { }
  ngOnInit(): void {
    var str = window.location.href;
    var n = str.lastIndexOf('/');
    this.result = str.substring(n + 1);
    this.getWebsite();
    this.getSetLimitData(this.result);
  }
  getWebsite(){
    this.apiService.getWhitelist().subscribe((res:any)=>{
      this.weblist= res;
    })
  }
  addSetLimit =new FormGroup({
    odds_min: new FormControl(100, Validators.required),
    odds_max: new FormControl(10000, Validators.required),
    odds_profitloss:new FormControl(200000,Validators.required),
    bookmaker_min: new FormControl(100,Validators.required),
    bookmaker_max:new FormControl(200000,Validators.required),
    bookmaker_profitloss:new FormControl(2000000,Validators.required),
    fancy_min: new FormControl(100,Validators.required),
    fancy_max:new FormControl(200000,Validators.required),
    fancy_profitloss:new FormControl(1000000,Validators.required),
  });

  addSetLimitForm(){
    this.payload={
      eventId : this.result,
      sites: ['all', Validators.required],
      oddsMin : this.addSetLimit.value.odds_min,
      oddsMax : this.addSetLimit.value.odds_max,
      oddsProfitLoss : this.addSetLimit.value.odds_profitloss,
      bookMakerMin : this.addSetLimit.value.bookmaker_min,
      bookMakerMax : this.addSetLimit.value.bookmaker_max,
      bookMakerProfitLoss : this.addSetLimit.value.bookmaker_profitloss,
      fancyMin : this.addSetLimit.value.fancy_min,
      fancyMax : this.addSetLimit.value.fancy_max,
      fancyProfitLoss : this.addSetLimit.value.fancy_profitloss
  }
  this.apiService.addSetLimitData(this.result,this.payload).subscribe((res:any)=>{
    // this.addSetLimit = res;
    Swal.fire({
      icon: 'success',
      title: "Set Limit Values updated successfully",
      showConfirmButton: false,
      timer: 1500
    })
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
  getSetLimitData(eventId:any){
    this.apiService.getSetLimit(eventId).subscribe((res:any)=>{
      this.setLimit = res;
      if(res.length > 0){
        this.addSetLimit.setValue({
          odds_min:res[0].oddsMin,
          odds_max:res[0].oddsMax,
          odds_profitloss:res[0].oddsProfitLoss,
          bookmaker_min:res[0].bookMakerMin,
          bookmaker_max:res[0].bookMakerMax,
          bookmaker_profitloss:res[0].bookMakerProfitLoss,
          fancy_min:res[0].fancyMin,
          fancy_max:res[0].fancyMax,
          fancy_profitloss:res[0].fancyProfitLoss,
        })
      }
    })
  }
}
