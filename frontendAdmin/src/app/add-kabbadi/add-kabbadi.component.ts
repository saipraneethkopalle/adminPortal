import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-add-kabbadi',
  templateUrl: './add-kabbadi.component.html',
  styleUrls: ['./add-kabbadi.component.css']
})
export class AddKabbadiComponent implements OnInit {
  submitted: boolean=false;
  errormsg: string='';
  matchData:any;
  showMatchData:any;
  type:any;
  router: any;
  testToggle:boolean = false;
  runnerToggle:boolean=false;
  matchForm:FormGroup | undefined;


  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.defaultRunners()
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
    this.matchData ={
      "eventId":this.Addwebsitenew.value.eventId,
      "marketId":this.Addwebsitenew.value.marketId,
      "marketName":"Match Odds",
      "eventName":this.Addwebsitenew.value.eventname,
      "sportId":5,
      "sportName":"Kabaddi",
      "competitionId":this.Addwebsitenew.value.competitionid,
      "competitionName":this.Addwebsitenew.value.competitionname,
      "openDate":this.Addwebsitenew.value.openDate,
      "type":this.Addwebsitenew.value.eventType,
      "matchRunners":[this.Addwebsitenew.value.runner1,this.Addwebsitenew.value.runner2,this.Addwebsitenew.value.runner3],
      "matchType":this.Addwebsitenew.value.matchType,
      "status":"OPEN"
      }
    console.log("payload",this.matchData);
    this.apiService.addManualMatch(this.matchData).subscribe((res:any)=>{
      this.showMatchData= res;
      console.log("Added Successfully");
      // this.router.navigate(["/addMatch"]);
    },(error:any)=>{console.log(error)})
  }
  setRunners(type:any) {
    console.log("type isssssssssss0",type)
    this.type = type.value;
    this.runnerToggle = this.type?true:false;
    this.testToggle = this.type=="Test"?true:false;
    this.type = this.type == "Test"?this.matchForm?.patchValue({runner3:''}):this.matchForm?.patchValue({runner3:'0'})
  }
  defaultRunners() {
    // console.log("type in set runners is",type.value)
    this.type = 'oneDay';
    this.runnerToggle = this.type ? true:false;
    this.testToggle = this.type == 'Test' ? true:false;
    this.type == 'Test' ? this.matchForm?.patchValue({runner3:''}) : this.matchForm?.patchValue({runner3:'0'})

  }
}
