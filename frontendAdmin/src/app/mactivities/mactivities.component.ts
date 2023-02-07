import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({

  selector: 'app-mactivities',
  templateUrl: './mactivities.component.html',
  styleUrls: ['./mactivities.component.css'],
})
export class MActivitiesComponent implements OnInit {
  matchesData: any;
  sport:any ;
  level:any;
  constructor(private apiService: AdminApiServiceService,private router:Router) {}

  ngOnInit(): void {
    this.getAllMatches();
    this.level = this.apiService.getUserLevel();
  }
  getAllMatches() {
    this.apiService.getRemovedData().subscribe((res: any) => {
      // console.log(res);
      this.matchesData = res;
      // console.log(this.matchesData);
    });
  }
  getMatchesBySport(name: any) {
    if(name.target.value) {
      this.sport = name.target.value;
      console.log("id",this.sport);
    }
    if (this.sport === 'All') {
      this.getAllMatches();
     } else {
       this.apiService.getRemovedData().subscribe((res: any) => {
        res=res.filter((data:any)=>{
           if(data.sportId == this.sport){
            return data;
           };
        })
        this.matchesData = res;
        // console.log(this.matchesData);
      });
    }
    // this.getAllMatches()
  }
  rollBackMatch(item:any) {

    this.apiService.rollBackMatchRedis(item.eventId,{isActive:true}).subscribe((res:any)=>{
      // console.log(res);
      if(res) {
        Swal.fire({
          icon: 'success',
          title: "Reverted Successfully",
          showConfirmButton: false,
          timer: 1500
        })
        this.getAllMatches();
      }
    })


  }

  redirect(data:any){
    this.router.navigate(['/showactivities'])
  }
}
