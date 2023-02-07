import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-tennis',
  templateUrl: './tennis.component.html',
  styleUrls: ['./tennis.component.css']
})
export class TennisComponent implements OnInit {

  matchList:any;
  sports: any;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.getMatchBySports("Tennis");
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
    // console.log(" i am printing match data inside add match component",match);
    this.apiService.addMatch(match).subscribe((res:any)=>{
      if(res) {
        // console.log("i am inside if loop  ")
        // this.status = true;
        Swal.fire({
          icon: 'success',
          title: "Match Added",
          showConfirmButton: false,
          timer: 1500
        })
        this.getMatchBySports("Tennis");
      }
    })
  }
}
