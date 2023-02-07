import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { AdminApiServiceService } from '../services/admin-api-service.service';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errormessage:any;
  isAuthenticated = false;
  timer:any;
  showPassword :any;
  isError:any;
  password:any;
  constructor(private apiService:AdminApiServiceService, private router:Router) { }
  login = new FormGroup({
    username: new FormControl("",Validators.required),
    password: new FormControl("",Validators.required)
  })
  ngOnInit(): void {
    this.logout();
    this.apiService.getAuthStatusListner().subscribe((response) => {
      this.isError = this.apiService.getError();
      // console.log("error message",this.isError);
      if(this.isError) {
        this.isAuthenticated = false;
      }
  });
  }

  toggleShow(){
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    // let body = {username:this.login.value.username,password:this.login.value.password}
    // this.apiService.adminLogin(body).subscribe((res:any)=>{
    //   if(res.status==1) {
    //     localStorage.setItem("logged","login success");
    //     localStorage.setItem("user",body.username?body.username:'name')
    //     localStorage.setItem("__token",res.token);
    //     localStorage.setItem("userLevel",res.data.level);
    //     this.isLogin = true;
    //     this.router.navigate(["/dashboard"]);
    //   }else {
    //     this.errormessage = res.message;
    //   }
    // },(error)=>{
    //   console.log('printing error',error.error)
    //   if(error.error.message=='invalid credentials') {
    //     this.errormessage = error.error.message
    //   }
    //   else if(error.name == "HttpErrorResponse"){
    //     this.errormessage = "Backend Server is not running";
    //   }
    // })
    const salt = bcrypt.genSaltSync(12);
    this.password = this.login.value.password;
    let pass = bcrypt.hashSync(this.password, salt);
    this.apiService.login(this.login.value.username,pass);
    this.login.reset();
    this.avoidback();

  }
  avoidback(){
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };

  }
  logout() {
    this.apiService.logout();

}
}
