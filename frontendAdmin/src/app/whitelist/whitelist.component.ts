import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.css']
})
export class WhitelistComponent implements OnInit {
  getWebsites:any;
  submitted: boolean=false;
  errormsg: string = "";
  payload:any;
  error: boolean=false;
  errorMessage:any;
  constructor(private apiService:AdminApiServiceService,private router:Router) { }

  ngOnInit(): void {
    this.getWhitelist();
  }
  getWhitelist(){
    this.apiService.getWhitelist().subscribe((res:any)=>{
      this.getWebsites = res;
      localStorage.setItem("domains",res);
    })
  }
  addWebList = new FormGroup({
    Name: new FormControl('', Validators.required),
    Domain: new FormControl('', Validators.required)
  });
  addWebsite(){
    this.submitted = true;
    if (this.addWebList.invalid) {
      this.errormsg = 'All fields Are Required!!'
      return;
    }
    this.payload ={
    name : this.addWebList.value.Name,
    domain : this.addWebList.value.Domain
    }
    this.apiService.addWebsite((this.payload)).subscribe((res:any)=>{
      // this.userList = this.payload;
      if(res.message){
        this.error = true;
        this.errorMessage = res.message;
      }else{
        // console.log(res);
        this.addWebList.reset();
        this.getWhitelist();
      }
    })

  }
  deleteWebsite(name:any) {
    // console.log(name);
    this.apiService.deleteWhiteList(name).subscribe((res:any)=>{
      // console.log(res);
      this.getWhitelist();
    })

  }


}
