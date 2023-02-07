import { Component, OnInit } from '@angular/core';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-addsoccer',
  templateUrl: './addsoccer.component.html',
  styleUrls: ['./addsoccer.component.css']
})
export class AddsoccerComponent implements OnInit {

  matchList:any;
  sports: any;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.getMatchBySports("Soccer");
  }
  getMatchBySports(sport:any){
    // console.log("show")
    this.sports = {sports:sport};
    this.apiService.getMatchBySportName(this.sports).subscribe((res:any)=>{
      this.matchList = res;
      // console.log("matchlist",this.matchList);
    })
  }
  addMatch(match:any)  {
    console.log(" i am printing match data inside add match component",match);

    this.apiService.addMatch(match).subscribe((res:any)=>{
      if(res) {
        // console.log("i am inside if loop  ")
        // this.status = true;
        this.getMatchBySports("Soccer");

      }
    })
  }

}
