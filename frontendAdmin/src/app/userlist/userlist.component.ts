import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit,OnChanges{
  userList:any;
  submitted: boolean = false;
  errormsg: string='';
  errorMessage:any;
  error:boolean =false;
  newPassword:any;
  payload:any;
  currentUser:any;
  updateUser:any;
  currentusername:any;
  currentpassword:any;
  isEmpty:boolean=true;
  constructor(private apiService:AdminApiServiceService,private router:Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getUsers();
  }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(){
    this.apiService.getUsers().subscribe((res:any)=>{
      this.userList = res;
    });
  }
  addUserList = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  addUsers(){
    this.submitted = true;
    this.error = false;
    if (this.addUserList.invalid) {
      this.error = true;
      this.errorMessage = 'All fields Are Required!!'
      return;
    }
    this.payload ={
    username:this.addUserList.value.username,
    password:this.addUserList.value.password
    }
    this.apiService.addUsers((this.payload)).subscribe((res:any)=>{
      if(res.message){
        this.error = true;
        this.errorMessage = res.message;
      }else{
      this.userList = [res];
      this.addUserList.reset();
      this.getUsers();
      }
    })


  }
  passcurrentUser(data:any){
    // console.log(data);
    this.currentUser = data;
    this.currentusername = data.username;
    this.currentpassword = data.slag;
    this.errormsg = '';
  }
  changePassword(data:any){
    this.newPassword = data.target.value;
    if (this.newPassword == undefined || this.newPassword == '') {
    this.isEmpty =true;
    this.errormsg = 'Password Required!'
    }else{
      this.isEmpty = false
      this.errormsg = '';
    }
    // console.log("changing",data.target.value)
  }
  updatePassword(data:any){
    this.errormsg  = '';

    if (this.newPassword == undefined || this.newPassword == '') {
      // this.error = true;
      this.isEmpty = true;
      this.errormsg = 'Password Required!'
      return;
    }else{
      this.isEmpty = false;
      this.updateUser = {
        username:data.username,
        password:this.newPassword
      }
      // console.log(this.updateUser);
      this.apiService.updateUser(this.updateUser).subscribe((res:any)=>{
        // console.log(res);
        this.getUsers();
      })
    }

    // console.log("empty",this.isEmpty,this.newPassword);
  }

}
