import { Component, OnInit } from '@angular/core';
import { AdminApiServiceService } from '../services/admin-api-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  isSubmittedM: boolean=false;

  constructor(private apiService:AdminApiServiceService) { }

  ngOnInit(): void {
  }
  setMessage() {
    return;
    let message = (<HTMLSelectElement>document.getElementById('messageBox')).value;
    // this.isLoadingM = true;
    this.isSubmittedM = true;
    this.apiService.setMessage({ message }).subscribe((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Successfully Update!',
        showConfirmButton: false,
        timer: 1500
      })
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong!',
          showConfirmButton: false,
          timer: 1500
        })

      });
  }

}
