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
    this.getApislistdata();
  }

  addApilist = new FormGroup({
    customerName: new FormControl('', Validators.required),
    ipAddress: new FormControl('', Validators.required),
    plan1:new FormControl(true),
    plan2:new FormControl(true),
    plan3:new FormControl('')
  });
  updateApi = new FormGroup({
    customerName2: new FormControl('', Validators.required),
    ipAddress2: new FormControl('', Validators.required),
    plann1:new FormControl(true),
    plann2:new FormControl(true),
    plann3:new FormControl('')
  });
  createWhitelist(){
    if(this.addApilist.invalid){
      console.log("error",this.addApilist.errors);
      this.error = true;
      this.errorMessage = "Please enter mandatory fields";
    }else{
      this.error = false;
      this.errorMessage = '';
      // console.log("plan3",this.addApilist.value.plan3)
    let payload = {
      "customerName":this.addApilist.value.customerName,
      "ipAddress":this.addApilist.value.ipAddress,
      "plan1":this.addApilist.value.plan1,
      "plan2":this.addApilist.value.plan2,
      "plan3":this.addApilist.value.plan3 == '' ? false : this.addApilist.value.plan3 == null ? false :this.addApilist.value.plan3
    }
    // console.log("created",payload);
    this.apiService.createApiWhitelist(payload).subscribe((res:any)=>{
      Swal.fire({
        icon: 'success',
        title: "Added Successfully",
        showConfirmButton: false,
        timer: 1500
      })
      this.getApislistdata();
      this.addApilist.reset();
      this.addApilist.patchValue({"plan1":true,"plan2":true})
    })
    }
  }
  getApislistdata(){
    this.apiService.getApiWhitelist().subscribe((res:any)=>{
      this.getApislist = res.data;
    })
  }
  passcurrentCustomer(data:any){
    this.currentData = data;
  }
  // updateValue(field:any,value:any){
  //   console.log("changed",field,value.target.value);
  //   if(field == 1 && value.target.value != null){
  //     this.currentData.customerName = value.target.value
  //   }
  //   if(field == 2 && value.target.value != null){
  //     this.currentData.ipAddress = value.target.value
  //   }
  //   if(field == 3){
  //     this.currentData.plan1 = value.target.value == "on" ? true : false;
  //   }
  //   if(field == 4){
  //     this.currentData.plan2 = value.target.value == "on" ? true : false;
  //   }
  //   if(field == 5){
  //     this.currentData.plan3 = value.target.value == "on" ? true : false;
  //   }
  // }

  updateApilist(id:any){
    let payload = {
      "_id":id,
      "customerName":this.updateApi.value.customerName2 == '' ? this.currentData.customerName : this.updateApi.value.customerName2,
      "ipAddress":this.updateApi.value.ipAddress2 == '' ? this.currentData.ipAddress : this.updateApi.value.ipAddress2,
      "plan1":this.updateApi.value.plann1,
      "plan2":this.updateApi.value.plann2,
      "plan3":this.updateApi.value.plann3 == '' ? false : this.updateApi.value.plann3
    }
    // console.log("update",payload)
    this.currentData = payload;
    this.apiService.updateApiWhitelist(payload).subscribe((res:any)=>{

      this.getApislistdata();
      // this.updateApi.reset();
      Swal.fire({
        icon: 'success',
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
}
