import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})
export class AddMatchComponent implements OnInit {
  matchList:any;
  sports:any;
  status = false;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.getMatchBySports("Cricket");
  }
  getMatchBySports(sport:any){
    // console.log("i am giving the result")
    this.sports = {sports:sport};
    this.apiService.getMatchBySportName(this.sports).subscribe((res:any)=>{
      this.matchList = res;
      // console.log(this.matchList);
    })
  }

  addMatch(match:any)  {
    // console.log(" i am printing match data inside add match component",match);
    this.apiService.addMatch(match).subscribe((res:any)=>{
      if(res) {
        Swal.fire({
          icon: 'success',
          title: "Successfully added",
          showConfirmButton: false,
          timer: 1500
        })
        // console.log("i am inside if loop  ")
        this.status = true;
        this.getMatchBySports("Cricket");

      }
    })
  }

}
