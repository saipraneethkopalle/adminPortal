import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-api-whitelist',
  templateUrl: './api-whitelist.component.html',
  styleUrls: ['./api-whitelist.component.css']
})
export class ApiWhitelistComponent implements OnInit {
  getApislist:any;
  error:any;
  errorMessage:any;
  plan1:any;plan2:any;plan3:any;
  currentData:any;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    // this.getApiWhitelist();
  }

  addApilist = new FormGroup({
    customerName: new FormControl('', Validators.required),
    ipAddress: new FormControl('', Validators.required),
    plan1:new FormControl(true),
    plan2:new FormControl(true),
    plan3:new FormControl('')
  });

  createWhitelist(){
    let payload = {
      "customerName":this.addApilist.value.customerName,
      "ipAddress":this.addApilist.value.ipAddress,
      "plan1":this.addApilist.value.plan1,
      "plan2":this.addApilist.value.plan2,
      "plan3":this.addApilist.value.plan3
    }
    console.log("created",payload);
    this.getApislist = [payload];
    // this.apiService.createApiWhitelist(payload).subscribe((res:any)=>{
    //   Swal.fire({
    //     icon: 'success',
    //     title: "Added Successfully",
    //     showConfirmButton: false,
    //     timer: 1500
    //   })
    // })
  }
  getApiWhitelist(){
    this.apiService.getApiWhitelist().subscribe((res:any)=>{
      this.getApislist = res.data;
    })
  }
  passcurrentCustomer(data:any){
    this.currentData = data;
  }
  updateValue(field:any,value:any){
    console.log("changed",field,value.target.value);
    if(field == 1 && value.target.value != null){
      this.currentData.customerName = value.target.value
    }
    if(field == 2 && value.target.value != null){
      this.currentData.ipAddress = value.target.value
    }
    if(field == 3){
      this.currentData.plan1 = value.target.value == "on" ? true : false;
    }
    if(field == 4){
      this.currentData.plan2 = value.target.value == "on" ? true : false;
    }
    if(field == 5){
      this.currentData.plan3 = value.target.value == "on" ? true : false;
    }
  }

  updateApilist(){
    console.log("updating",this.currentData);
    // this.apiService.updateApiWhitelist(this.currentData).subscribe((res:any)=>{
    //   Swal.fire({
    //     icon: 'success',
    //     title: "Updateed Successfully",
    //     showConfirmButton: false,
    //     timer: 1500
    //   })
    // })
  }
}
