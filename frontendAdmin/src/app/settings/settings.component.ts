import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminApiServiceService } from '../services/admin-api-service.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  providers:any='';
  matchSet:any = '';
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.getProvider();
    this.getMatchSettings();
  }
  oddProvider = new FormGroup({
    odd: new FormControl('', Validators.required),
    fancy: new FormControl('', Validators.required),
    bookmaker:new FormControl('', Validators.required)
  });
  matchSettings = new FormGroup({
    cricket: new FormControl('',Validators.required),
    soccer:new FormControl('',Validators.required),
    tennis:new FormControl('',Validators.required)
  })
  

  addProvider(){
    let payload = {
      "settings_type":"Provider",
      odds:this.oddProvider.value.odd != "" ? this.oddProvider.value.odd?.toLowerCase():this.providers.odds,
      fancy:this.oddProvider.value.fancy != "" ? this.oddProvider.value.fancy?.toLowerCase():this.providers.fancy,
      bookmaker:this.oddProvider.value.bookmaker != "" ? this.oddProvider.value.bookmaker?.toLowerCase():this.providers.bookmaker
    }
    this.apiService.addProviderSettings(payload).subscribe((res:any)=>{
      Swal.fire({
        icon: 'success',
        title: "Successfully updated",
        showConfirmButton: false,
        timer: 1500
      })
      // console.log("success",res);
    })
  }
  getProvider(){
    this.apiService.getProviderSettings().subscribe((res:any)=>{

      this.providers = res[0];
      // console.log(this.providers);
    })
  }
  setTOn(allow:any) {

    this.apiService.tAllow(allow).subscribe((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Successfully Update!',
        showConfirmButton: false,
        timer: 1500
      })
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  setTOff(allow:any) {
    // this.isLoading = true;
    this.apiService.tAllow(allow).subscribe((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Successfully Update!',
        showConfirmButton: false,
        timer: 1500
      })
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  setROn(allow:any) {
    // this.isLoading = true;
    this.apiService.rAllow(allow).subscribe((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Successfully Update!',
        showConfirmButton: false,
        timer: 1500
      })
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  setROff(allow:any) {
    // this.isLoading = true;
    this.apiService.rAllow(allow).subscribe((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Successfully Update!',
        showConfirmButton: false,
        timer: 1500
      })
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }


  addMatchSetting() {
    let payload = {
      
      cricket:this.matchSettings.value.cricket != "" ? this.matchSettings.value.cricket?.toLowerCase():this.matchSet.cricket,
      soccer:this.matchSettings.value.soccer != "" ? this.matchSettings.value.soccer?.toLowerCase():this.matchSet.soccer,
      tennis: this.matchSettings.value.tennis != ""? this.matchSettings.value.tennis?.toLowerCase():this.matchSet.tennis
      
    }
    console.log("i am printing teh pay load",payload)
    this.apiService.matchSettings(payload).subscribe((res:any)=>{
      // console.log('res',res)
      Swal.fire({
        icon: 'success',
        title: 'Successfully Update!',
        showConfirmButton: false,
        timer: 1500
      })
    
    })

  }
  getMatchSettings() {
    this.apiService.getMatchSettings().subscribe((res:any)=>{
      // console.log(" res coming here",res)
      this.matchSet = res[0];
    })
  }

 


}
