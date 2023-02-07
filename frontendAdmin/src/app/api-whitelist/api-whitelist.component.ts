import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminApiServiceService } from '../services/admin-api-service.service';

@Component({
  selector: 'app-api-whitelist',
  templateUrl: './api-whitelist.component.html',
  styleUrls: ['./api-whitelist.component.css']
})
export class ApiWhitelistComponent implements OnInit {
  getWebsites:any;
  error:any;
  errorMessage:any;
  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
  }

  addApilist = new FormGroup({
    url: new FormControl('', Validators.required)
  });
}
