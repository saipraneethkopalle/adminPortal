import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.css']
})
export class ServerStatusComponent implements OnInit {
  process:any;
  centralConn = 0;
  scoreConn = 0;
  private centralSubO: Subscription | undefined;
  private scoreSubO: Subscription | undefined;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
    this.apiService.getProcess().subscribe((res:any)=>{
        this.process = res.data;
    });
  }
  ngOnDestroy() {
    //this.chatService.destorySocket();
    if (this.centralSubO) {
      this.centralSubO.unsubscribe();
    }

    if (this.scoreSubO) {
      this.scoreSubO.unsubscribe();
    }
  }
}
