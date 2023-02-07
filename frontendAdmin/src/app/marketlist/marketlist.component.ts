import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-marketlist',
  templateUrl: './marketlist.component.html',
  styleUrls: ['./marketlist.component.css']
})
export class MarketlistComponent implements OnInit {
  id: any;
  marketData:any
  eventName:any
  constructor(private route:ActivatedRoute, private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.eventName = localStorage.getItem('eventName')
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        }});
      
      
    this.getMarketList()
  }
  getMarketList() {
    // this.id = '32066520'
    this.apiService.getMarketData(this.id).subscribe((res:any)=>{
      console.log("res",res)
      this.marketData = res.result;
    })


  }

}
