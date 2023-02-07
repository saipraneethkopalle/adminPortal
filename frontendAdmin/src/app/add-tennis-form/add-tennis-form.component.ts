import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-add-tennis-form',
  templateUrl: './add-tennis-form.component.html',
  styleUrls: ['./add-tennis-form.component.css']
})
export class AddTennisFormComponent implements OnInit {
  type:any;
  matchForm: FormGroup | any;
  runnerToggle:boolean =false;
  testToggle:boolean =false;
  submitted: boolean=false;
  errormsg: string='';
  matchData:any;
  showMatchData:any;
  constructor(private apiService:AdminApiServiceService,private router:Router) { }

  ngOnInit(): void {
    this.defaultRunners();
  }
  Addwebsitenew = new FormGroup({
    eventId: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]+$/)]),
    marketId: new FormControl('', [Validators.required,Validators.pattern(/[+-]?([0-9]*[.])?[0-9]+/)]),
    eventname:new FormControl('',Validators.required),
    openDate: new FormControl('',Validators.required),
    competitionid:new FormControl('',[Validators.required,Validators.pattern(/^[0-9]+$/)]),
    competitionname:new FormControl('',Validators.required),
    runner1: new FormControl('', Validators.required),
    runner2: new FormControl('', Validators.required),
    runner3: new FormControl('0', Validators.required),
    matchType: new FormControl(''),
    eventType: new FormControl('')
  });
  get f() { return this.Addwebsitenew.controls; }

  addMatch(){
    this.submitted = true;
    if (this.Addwebsitenew.invalid) {
      this.errormsg = 'All fields Are Required!!'
      return;
    }
    // if (this.Addwebsitenew.invalid) {
    //   // this.isLoading = false;
    //   return false ;
    // } 
    // console.log("i am inside add match function")
    // this.Addwebsitenew.value.openDate =this.datepipe.transform(this.Addwebsitenew.value.openDate, 'MM/dd/YYY hh:mm:ss');
    this.matchData ={
      "eventId":this.Addwebsitenew.value.eventId,
      "marketId":this.Addwebsitenew.value.marketId,
      "marketName":"Match Odds",
      "eventName":this.Addwebsitenew.value.eventname,
      "sportId":2,
      "sportName":"Tennis",
      "competitionId":this.Addwebsitenew.value.competitionid,
      "competitionName":this.Addwebsitenew.value.competitionname,
      "openDate":this.Addwebsitenew.value.openDate,
      "type":this.Addwebsitenew.value.eventType,
      "matchRunners":[this.Addwebsitenew.value.runner1,this.Addwebsitenew.value.runner2,this.Addwebsitenew.value.runner3],
      "addType":this.Addwebsitenew.value.matchType,
      "status":"OPEN",
      "isActive":true,
      "isResult":false
      }
    // console.log("payload",this.matchData);
    this.apiService.addManualMatch(this.matchData).subscribe((res:any)=>{
      this.showMatchData= res;
      Swal.fire({
        title:'Success!',
        text:'Tennis Match Added Successfully',
        timer:1500

      })
      this.router.navigate(["/tennis"]);
    },(error:any)=>{console.log(error)})
  }

  setRunners(type:any) {
    // console.log("type in set runners is",type.value)
    this.type = type.value;
    this.runnerToggle = this.type ? true:false;
    this.testToggle = this.type == 'Test' ? true:false;
    this.type == 'Test' ? this.matchForm?.patchValue({runner3:''}) : this.matchForm?.patchValue({runner3:'0'})

  }
  defaultRunners() {
    // console.log("type in set runners is",type.value)
    this.type = 'oneDay';
    this.runnerToggle = this.type ? true:false;
    this.testToggle = this.type == 'Test' ? true:false;
    this.type == 'Test' ? this.matchForm?.patchValue({runner3:''}) : this.matchForm?.patchValue({runner3:'0'})

  }
}

