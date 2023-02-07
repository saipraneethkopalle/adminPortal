import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Subscription, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AdminApiServiceService } from '../services/admin-api-service.service';
import { SocketServiceService } from '../services/socket-service.service';

@Component({
  selector: 'app-fancy',
  templateUrl: './fancy.component.html',
  styleUrls: ['./fancy.component.css']
})
export class FancyComponent implements OnInit {
  eventData: any;
  eventName: any;
  eventStatus: any;
  result: any;
  changedValue: any;
  Provider: any;
  id: any;
  oddsub: Subscription | undefined;
  oddsub2: Subscription | undefined;
  private destroyed = new Subject();
  private fancySub: Subscription | undefined;
  private autoFancyStatusSub: Subscription | undefined;
  statusFancyAuto:any;
  marketIds: string[] = [];
  inactiveArr: string[] = [];
  fancyList: any =[];
  userId: any;
  sportName: any;
  Active: boolean = false;
  inactive: boolean = false;
  inactiveList: any;
  removedList:any;
  activeList:any;
  createdBy:any;
  allactive: boolean = true;
  closed: boolean = false;
  removed:boolean = false;
  matchOddsId: any;
  closedList: any;
  searchTerm: any;
  oddsType: any;
  oddsType2:any;
  runners: any;
  runnersList: any;
  runnersList2: any;
  listdata: any;
  beforeSearchList: any;
  marketId: any;
  sportId: any;
  matchData: any;
  operation:any;
  fancyProvider:any;
  bookmakerProvider:any;
  fancyTimeout:any;
  fancytype:any;
  newFancies:any;
  search:boolean = false;
  searchValue:any = '';
  fanciesType = { "1": "normal_fancies", "2": "khado_fancies", "3": "meter_fancies", "4": "fancy_1_fancies", "5": "ball_by_ball_fancies" };
  constructor(private apiService: AdminApiServiceService,private route:ActivatedRoute, private router: Router, private socket: SocketServiceService) { }

  ngOnInit(): void {
    // var str = window.location.href;
    // var n = str.lastIndexOf('/');
    // this.result = str.substring(n + 1);
    this.createdBy = localStorage.getItem("user");
    this.operation = 'All';
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has('id')) {
        this.result = paramMap.get('id');
    this.apiService.getEventDetail(this.result).subscribe((res: any) => {
      this.eventData = res;
      this.eventName = res[0].eventName;
      this.Provider = res[0].oddsProvider;
      this.fancyProvider = res[0].fancyProvider;
      this.bookmakerProvider = res[0].bookmakerProvider;
      this.sportId = res[0].sportId;
      this.marketId = res[0].marketId;
      this.runners = res[0].matchRunners;
      this.fancytype =res[0].fancyAType;
      console.log("type",this.fancytype);
      this.socket.setOdds(this.result);
      this.socket.getOdds(this.result);

      this.oddsub = this.socket.getUpdateMessageListner().subscribe((res: any) => {
        this.oddsType = res.message['Type'];
        if (res.message['data'].length > 0) {
          if (this.oddsType == 'Betfair' || this.oddsType == 'Tiger' || this.oddsType == 'Ryan') {
            // console.log(res.message['data'])
            res.message['data'][0].runners = res.message['data'][0].runners.filter((m:any)=>{
              m.ex.availableToBack= m.ex.availableToBack.reverse();
              return  m;
              })
            this.runnersList = res.message['data'][0];
          } else if (this.oddsType == 'Sky' || this.oddsType == 'Diamond') {
            // res.message['data'].runners = res.message['data'].runners.filter((m:any)=>{
            //   m.ex.availableToBack= m.ex.availableToBack.reverse();
            //   return  m;
            //   })
            this.runnersList = res.message['data'];
          }
        } else {
          this.runnersList = [];
        }
      });
      if (this.sportId == '4') {
      this.socket.setBookMaker(this.result);
      this.socket.getBookMaker(this.result);
      this.oddsub2 = this.socket.getUpdate2MessageListner().subscribe((res: any) => {
        this.oddsType2 = res.message2['Type'];
        if (res.message2['data'].length > 0) {

          if (this.oddsType2 == 'Diamond') {
            // console.log("bookMaker",res.message2['data'][0].bm1)
            this.runnersList2 = res.message2['data'][0].bm1.reverse();
          }
          else if (this.oddsType2 == 'Virtual' || this.oddsType2 == 'Jdiamond') {
            this.runnersList2 = res.message2['data'][0].bm2.reverse();
          }
        }
      });


        this.apiService.getFancy(this.result, this.marketId, this.fancyProvider, this.operation);
        this.fancyTimer();
      }
      this.fancySub = this.apiService.getUpdateFancyListner().subscribe((resp:any) => {
        if (resp.fancy['result'].data == null) {
          this.fancyList = [];
          this.destroyed.next(void 0);
          this.fancyTimeout = setTimeout(() => {
            this.fancyTimer();
          }, 3000);

        }
        else {
          if (this.fancyProvider == 'diamond') {
            let data = JSON.parse(resp.fancy['result'].data);
                let datas = data.data.t3 || [];
                this.fancyList = [...datas].filter(resp => {
                  return resp?.ballsess != '3';
                }).sort((a, b) => (a.srno > b.srno) ? 1 : -1);
                // this.newFancies = [...datas].filter(resp => {
                //   return resp?.ballsess != '3';
                // }).sort((a, b) => (a.srno > b.srno) ? 1 : -1);
                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }

          }else if (this.fancyProvider == 'virtual' || this.fancyProvider == 'jdiamond') {
            let data = JSON.parse(resp.fancy['result'].data);
            let datas = data.t3 || [];
            this.fancyList = [...datas].sort((a, b) => (a.srno > b.srno) ? 1 : -1);
            // this.newFancies = [...datas].sort((a, b) => (a.srno > b.srno) ? 1 : -1);
          }
          else if (this.fancyProvider == 'sky') {
            let datas = JSON.parse(resp.fancy['result'].data);
            this.fancyList = datas.filter((resp:any) => {
              return resp.status != '18' && resp.status != '1' && resp.status != '14';
            });
            // this.newFancies = datas.filter((resp:any) => {
            //   return resp.status != '18' && resp.status != '1' && resp.status != '14';
            // });
          }
          else if (this.fancyProvider == 'sk') {
            this.fancyList = JSON.parse(resp.fancy['result'].data);
            // this.newFancies = JSON.parse(resp.fancy['result'].data)
          }
          else {
            let datas = JSON.parse(resp.fancy['result'].data);
            this.fancyList = datas;
            // this.newFancies = datas;
          }

          this.autoFancyStatusSub = this.apiService.getAutoUpdateFancyStatusListner().subscribe((autoFancy:any) => {
            if(autoFancy.autoFancyStatus.length > 0){
            this.statusFancyAuto = autoFancy.autoFancyStatus;
            if (this.fancyProvider == 'diamond') {
              if (this.operation == 'All') {
                this.fancyList = this.NewAutoFancies(this.fancyList, this.statusFancyAuto);
                // this.newFancies = this.NewAutoFancies(this.fancyList, this.statusFancyAuto);
                this.fancyList = this.NewAutoSearchFancies(this.searchValue)

                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
              else {
                let adata2 = this.OtherAutoFancies(this.fancyList, this.statusFancyAuto);
                let NR = this.OtherAutoFancies2(this.statusFancyAuto, adata2);
                const mappedN = NR.map((e:any) => {
                  e = {
                    ...e,
                    'sid': e.runnerId,
                    'nat': e.name,
                    'ls1': 0,
                    'bs1': 0,
                    'l1': 0,
                    'b1': 0,
                    'gstatus': 'SUSPENDED',
                    'gtype': e.type
                  };
                  return e;
                });
                this.fancyList = [...adata2, ...mappedN];
                this.fancyList = this.NewAutoSearchFancies(this.searchValue)

                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
            }
            else if (this.fancyProvider == 'virtual' || this.fancyProvider == 'jdiamond') {
              if (this.operation == 'All') {
                this.fancyList = this.NewAutoFancies(this.fancyList, this.statusFancyAuto);
                // this.newFancies = this.NewAutoFancies(this.fancyList, this.statusFancyAuto);
                this.fancyList = this.NewAutoSearchFancies(this.searchValue);
                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
              else {
                let adata2 = this.OtherAutoFancies(this.fancyList, this.statusFancyAuto);
                let NR = this.OtherAutoFancies2(this.statusFancyAuto, adata2);
                const mappedN = NR.map((e:any) => {
                  e = {
                    ...e,
                    'sid': e.runnerId,
                    'nat': e.name,
                    'ls1': 0,
                    'bs1': 0,
                    'l1': 0,
                    'b1': 0,
                    'gstatus': 'SUSPENDED',
                    'gtype': e.type
                  };
                  return e;
                });
                this.fancyList = [...adata2, ...mappedN];
                this.fancyList = this.NewAutoSearchFancies(this.searchValue);

                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
            }
            else if (this.fancyProvider == 'sky') {
              if (this.operation == 'All') {
                this.fancyList = this.NewAutoSkyFancies(this.fancyList, this.statusFancyAuto);
                this.fancyList = this.NewAutoSearchSkyFancies(this.searchValue);
                // this.newFancies = this.NewAutoSkyFancies(this.fancyList, this.statusFancyAuto);
                // this.fancyList = this.NewAutoSearchSkyFancies(this.searchValue);

              }
              else {
                let adata2 = this.OtherAutoSkyFancies(this.fancyList, this.statusFancyAuto);
                let NR = this.OtherAutoSkyFancies2(this.statusFancyAuto, adata2);
                const mappedN = NR.map((e:any) => {
                  e = {
                    ...e,
                    'marketId': e.runnerId,
                    'marketName': e.name,
                    'oddsYes': 0,
                    'oddsNo': 0,
                    'runsYes': 0,
                    'runsNo': 0,
                    'status': '6'
                  };
                  return e;
                });
                this.fancyList = [...adata2, ...mappedN];
                this.fancyList = this.NewAutoSearchSkyFancies(this.searchValue);

                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
            }
            else if (this.fancyProvider == 'sk') {
              if (this.operation == 'All') {
                this.fancyList = this.NewAutoSkFancies(this.fancyList, this.statusFancyAuto);
                this.fancyList = this.NewAutoSearchSkFancies(this.searchValue);

                // this.newFancies = this.NewAutoSkyFancies(this.fancyList, this.statusFancyAuto);
                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
              else {
                let adata2 = this.OtherAutoSkFancies(this.fancyList, this.statusFancyAuto);
                let NR = this.OtherAutoSkFancies2(this.statusFancyAuto, adata2);
                const mappedN = NR.map((e:any) => {
                  e = {
                    ...e,
                    'sky_fancy_id': e.runnerId,
                    'runner_name': e.name,
                    'yes_odd': 0,
                    'no_odd': 0,
                    'yes_bhav': 0,
                    'no_bhav': 0,
                    'is_sus': 1
                  };
                  return e;
                });
                this.fancyList = [...adata2, ...mappedN];
                this.fancyList = this.NewAutoSearchSkFancies(this.searchValue);

              }
            }
            else if (this.fancyProvider == 'betfair') {
              if (this.operation == 'All') {
                this.fancyList = this.NewAutoNeerajFancies(this.fancyList, this.statusFancyAuto);
                this.fancyList = this.NewAutoSearchNeerajFancies(this.searchValue);

                // this.newFancies = this.NewAutoNeerajFancies(this.fancyList, this.statusFancyAuto);

              }
              else {
                let adata2 = this.OtherAutoNeerajFancies(this.fancyList, this.statusFancyAuto);
                let NR = this.OtherAutoNeerajFancies2(this.statusFancyAuto, adata2);
                const mappedN = NR.map((e:any) => {
                  e = {
                    ...e,
                    'SelectionId': e.runnerId,
                    'RunnerName': e.name,
                    'LayPrice1': 0,
                    'BackPrice1': 0,
                    'LaySize1': 0,
                    'BackSize1': 0,
                    'GameStatus': 'SUSPENDED'
                  };
                  return e;
                });
                this.fancyList = [...adata2, ...mappedN];
                this.fancyList = this.NewAutoSearchNeerajFancies(this.searchValue);

                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
            }
            else if (this.fancyProvider == 'tiger') {
              if (this.operation == 'All') {
                this.fancyList = this.NewAutoTigerFancies(this.fancyList, this.statusFancyAuto);
                // this.newFancies = this.NewAutoTigerFancies(this.fancyList, this.statusFancyAuto);
                this.fancyList = this.NewAutoSearchTigerFancies(this.searchValue);

                // if(this.searchTerm){
                //   this.autosearch(this.searchTerm);
                //   }
              }
              else {
                let adata2 = this.OtherAutoTigerFancies(this.fancyList, this.statusFancyAuto);
                let NR = this.OtherAutoTigerFancies2(this.statusFancyAuto, adata2);
                const mappedN = NR.map((e:any) => {
                  e = {
                    ...e,
                    'id': e.id,
                    'name': e.name,
                    'ls1': 0,
                    'bs1': 0,
                    'l1': 0,
                    'b1': 0,
                    'status': 'SUSPENDED'
                  };
                  return e;
                });
                this.fancyList = [...adata2, ...mappedN];
                this.fancyList = this.NewAutoSearchTigerFancies(this.searchValue);

              }
            }

          }else{
            if(this.operation != 'All'){
            this.fancyList =[];
            }
          }
          });

        }
      });

    });
    }
    })
  //   setTimeout(()=>{
  //   if(this.fancytype == "auto" && this.fancyList.length > 0){
  //     this.autoActive("Active",this.fancyList);
  //     interval(10 * 1000).pipe(takeUntil(this.destroyed)).subscribe(() => {
  //       if(this.newFancies.length > 0 && this.fancytype == "auto"){
  //       this.autoActive("Active",this.newFancies);
  //       }
  //     });
  //   }
  // },1001)
  }

  // getEvents(result: any) {

  // }
  changeOdds(current: any) {
    this.changedValue = current.target.value;
  }
  fancyTimer() {
    interval(1000).pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.apiService.getFancy(this.result, this.marketId, this.fancyProvider, this.operation);

    });
  }


  updateProvider() {
    let payload = {
      "eventId": this.result,
      "oddsProvider": this.changedValue
    }
    this.apiService.updateProvider(payload).subscribe((res: any) => {
      this.Provider = this.changedValue;
      // this.getLayBack(this.Provider);
      Swal.fire({
        icon: 'success',
        title: "Odds Value updated successfully",
        showConfirmButton: false,
        timer: 1500
      })

    })
  }
  selectionName(name: any) {
    return this.runners.filter((o: any) => {
      return o.selectionId == name
    });
  }
  redirecteve() {
    this.router.navigate(['/home'])
  }
  inactiveFancy(item: any) {
    this.apiService.getRemoveFancy({ "data": [item] }).subscribe((res: any) => {


      this.getStatus();
    })

  }
  getInactivityList() {
    this.apiService.getInactive().subscribe((res: any) => {
      this.inactiveList = res;
      this.inactive = true;
      this.Active = false;
      this.closed = false;
      this.allactive = false;
      this.removed = false;
    })
  }
  activeFancy(data: any,status:any) {
    let payload = { eventId:this.result, selectionId: this.result + '-' + data.sid + '.FY', name: data.nat, runnerId: data.sid, status: status, provider: this.fancyProvider }
    this.apiService.getActiveFancy({ "data": [payload] }).subscribe((res: any) => {

      Swal.fire({
        icon: 'success',
        title: "Mark Status updated successfully",
        showConfirmButton: false,
        timer: 1500
      })
    })
    this.getStatus();
  }
  getStatus(){
    this.apiService.getAllActive({"eventId":this.result,"activeStatus":true}).subscribe((res:any)=>{
      this.activeList = res;
    })
    this.apiService.getAllActive({"eventId":this.result,"activeStatus":false}).subscribe((res:any)=>{
      this.inactiveList = res;
    })

  }

  closedFancy() {
    this.closed = true;
    this.Active = false;
    this.inactive = false;
    this.allactive = false;
    this.removed = false;
    this.closedList = [...this.activeList,...this.inactiveList].filter((cls:any)=>{if(cls.closed == true){return cls;}})
  }
  removedFancy() {
    this.closed = false;
    this.Active = false;
    this.inactive = false;
    this.allactive = false;
    this.removed = true;
    this.operation = "Removed";
    this.destroyed.next(void 0);
    this.fancyTimer();
  }

  closeFancy(item: any) {
    this.apiService.closeFancyItem({ "data": [item] }).subscribe((res: any) => {
      Swal.fire({
        icon: 'success',
        title: "Fancy closed successfully",
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
  setFancyStatus(status:any, eventId:any, selectionId:any, name:any, runnerId:any, provider:any, data:any) {
    let marketId = selectionId;
    const type = provider == 'diamond' ? data.gtype : 'Fancy';

    this.apiService.setFancyStatus(status, eventId, selectionId, name, provider, marketId, runnerId, data, type,this.createdBy)
      .subscribe((response:any) => {
        Swal.fire({
          icon: 'success',
          title: "Status updated successfully",
          showConfirmButton: false,
          timer: 1500
        })
      })
    }
    getFancyByStatus(status:any, id:any) {
      let btn = document.getElementById(id);
      let btnall = document.getElementById('all');
      let btnin = document.getElementById('inactive');
      let btna = document.getElementById('active');
      let btnc = document.getElementById('close');
      let btnr = document.getElementById('remove');
      btnall?.classList.add("btn-primary");
      btnin?.classList.add("btn-primary");
      btna?.classList.add("btn-primary");
      btnc?.classList.add("btn-primary");
      btnr?.classList.add("btn-primary");

      btnall?.classList.remove("btn-success");
      btnin?.classList.remove("btn-success");
      btna?.classList.remove("btn-success");
      btnc?.classList.remove("btn-success");
      btnr?.classList.remove("btn-success");
      btn?.classList.add("btn-success");
      this.destroyed.next(void 0);
      this.operation = status;
      this.fancyTimer();
    }
    closePopup(status:any, eventId:any, fancyid:any, selectionId:any, name:any, type:any, gtype:any) {
      let selection = fancyid;
      console.log("nat value",name);
      const ftype = type || gtype || 'Fancy';
      if (ftype == 'Fancy' || ftype == 'fancy') {
        Swal.fire({
          title: 'Enter Winning Runs',
          html: name + '<br> <input type="number" id="result" placeholder="Enter Runs" class="form-control">',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        }).then((res) => {
          if (res.value) {
            this.setResult(this.result, selectionId, name);
          }
        });
      }
      else if (ftype == 'fancy1') {
        Swal.fire({
          title: 'Select Options',
          html: name + '<br> <div>Yes <input value="1" style="margin-right:10px" type="radio" name="radio">No <input type="radio" value="0" name="radio"></div>',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        }).then((res) => {
          if (res.value) {
            this.setResult2(this.result, selectionId, name);
          }
        });
      }
    }
    setResult(eventId:any, selection:any, name:any) {
      const input = (<HTMLInputElement>document.getElementById("result")).value;
      this.apiService.setResult(parseInt(input), eventId, selection, name,this.createdBy).subscribe((response) => {
      });
    }

    setResult2(eventId:any, selection:any, name:any) {
      const input = (<HTMLInputElement>document.querySelector('input[name="radio"]:checked')).value;
      this.apiService.setFancy1Result(parseInt(input), eventId, selection, name,this.createdBy).subscribe((response) => {
      });
    }

    rollbackPopup(eventId:any, fancyid:any, selectionId:any, type:any, gtype:any) {
      const ftype = type || gtype || 'Fancy';
      const id = selectionId ? selectionId : fancyid;
      Swal.fire({
        title: 'Are you sure want to rollback this result ?',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel'
      }).then((result:any) => {
        if (result.value) {
          if (ftype == 'Fancy' || ftype == 'fancy') {
            this.rollbackResult(eventId, id);
          }
          else if (ftype == 'fancy1') {
            this.rollbackFancy1Result(eventId, id);
          }
        }
      })
    }

    rollbackResult(eventId:any, selection:any) {
      this.apiService.setResultRollback(eventId, selection).subscribe((response:any) => {
      });
    }

    rollbackFancy1Result(eventId:any, selection:any) {
      this.apiService.setFancy1ResultRollback(eventId, selection).subscribe((response:any) => {
      });
    }

  // search(value: any): void {
  //   value = value.target.value
  //   this.searchTerm = value;
  //   if (value != '') {
  //     this.fancyList = this.fancyList.filter((val: any) =>
  //       val.nat.toLowerCase().includes(value)
  //     );
  //   }
  // }
  autosearch(value: any): void {
    // value = value.target.value
    this.searchTerm = value;
    if (value != '') {
      this.fancyList = this.fancyList.filter((val: any) =>
        val.nat.toLowerCase().includes(value)
      );
    }
  }
  insertAllFancy(status:any, fancy:any) {
    let nFancy = [];
    let nFancyLogs = [];
    if (this.fancyProvider == 'diamond') {
      nFancy = fancy.map((data:any) => ({ eventId:this.result, selectionId: this.result + '-' + data.sid + '.FY', name: data.nat, runnerId: data.sid, status: status, provider: this.fancyProvider }));
      nFancyLogs = fancy.map((data:any) => ({ eventId: this.result, selectionId:this.result + '-' + data.sid + '.FY', result: data.nat, type1: 'Fancy', value: status, type2: this.fancyProvider,"createdBy":this.createdBy,createdAt:(new Date()).toISOString() }));
    }
    else if (this.fancyProvider == 'sky') {
      nFancy = fancy.map((data:any) => ({ eventId: this.result, selectionId: this.result + '-' + data.marketId + '.FY', name: data.marketName, runnerId: data.marketId, status: status, provider: this.fancyProvider }));
      nFancyLogs = fancy.map((data:any) => ({ eventId: this.result, selectionId: this.result + '-' + data.marketId + '.FY', result: data.marketName, type1: 'Fancy', value: status, type2: this.fancyProvider,"createdBy":this.createdBy,createdAt:(new Date()).toISOString() }));
    }
    else if (this.fancyProvider == 'betfair') {
      nFancy = fancy.map((data:any) => ({ eventId: this.result, selectionId:this.result + '-' + data.SelectionId + '.FY', name: data.RunnerName, runnerId: data.SelectionId, status: status, provider: this.fancyProvider }));
      nFancyLogs = fancy.map((data:any) => ({ eventId: this.result, selectionId: this.result + '-' + data.SelectionId + '.FY', result: data.RunnerName, type1: 'Fancy', value: status, type2: this.fancyProvider,"createdBy":this.createdBy,createdAt:(new Date()).toISOString() }));
    }

    this.apiService.activeAllFancy(nFancy, nFancyLogs, this.result)
      .subscribe((res:any) => {
        this.msgSuccess();
      });
  }
  // autoActive(status:any,fancy:any){
  //   let nFancy = [];
  //   let nFancyLogs = [];
  //   if (this.fancyProvider == 'diamond') {
  //     nFancy = fancy.map((data:any) => ({ eventId:this.result, selectionId: this.result + '-' + data.sid + '.FY', name: data.nat, runnerId: data.sid, status: status, provider: this.fancyProvider,"type":"fancy" }));
  //     nFancyLogs = fancy.map((data:any) => ({ eventId: this.result, selectionId:this.result + '-' + data.sid + '.FY', result: data.nat, type1: 'Fancy', value: status, type2: this.fancyProvider,"createdBy":this.createdBy,createdAt:(new Date()).toISOString() }));
  //   }
  //   else if (this.fancyProvider == 'sky') {
  //     nFancy = fancy.map((data:any) => ({ eventId: this.result, selectionId: this.result + '-' + data.marketId + '.FY', name: data.marketName, runnerId: data.marketId, status: status, provider: this.fancyProvider,"type":"fancy" }));
  //     nFancyLogs = fancy.map((data:any) => ({ eventId: this.result, selectionId: this.result + '-' + data.marketId + '.FY', result: data.marketName, type1: 'Fancy', value: status, type2: this.fancyProvider,"createdBy":this.createdBy,createdAt:(new Date()).toISOString() }));
  //   }
  //   else if (this.fancyProvider == 'betfair') {
  //     nFancy = fancy.map((data:any) => ({ eventId: this.result, selectionId:this.result + '-' + data.SelectionId + '.FY', name: data.RunnerName, runnerId: data.SelectionId, status: status, provider: this.fancyProvider,"type":"fancy" }));
  //     nFancyLogs = fancy.map((data:any) => ({ eventId: this.result, selectionId: this.result + '-' + data.SelectionId + '.FY', result: data.RunnerName, type1: 'Fancy', value: status, type2: this.fancyProvider,"createdBy":this.createdBy,createdAt:(new Date()).toISOString() }));
  //   }

  //   this.apiService.activeAllFancy(nFancy, nFancyLogs, this.result)
  //     .subscribe((res:any) => {
  //       // this.msgSuccess();
  //     });
  // }

    msgSuccess() {
      Swal.fire({
        icon: 'success',
        title: 'Successfully Update!',
        showConfirmButton: false,
        timer: 1500
      })
    }

  redirectToActivities(data: any) {
    this.router.navigate([`fancyactivities/${data.sid}/${data.marketid}`])

  }
  NewAutoFancies(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.sid) === selectionId
      }));
  }

  NewAutoSkyFancies(array1:any, array2:any) {
    return array1.filter((o:any)=> !array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.marketId) === selectionId
      }));
  }

  NewAutoBullFancies(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.id) === selectionId
      }));
  }

  NewAutoNeerajFancies(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.SelectionId) === selectionId
      }));
  }

  NewAutoTigerFancies(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.id) === selectionId
      }));
  }
  OtherAutoFancies(array1:any, array2:any) {
    return array1.filter((o:any) => array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.sid) === selectionId
      }));
  }

  OtherAutoSkyFancies(array1:any, array2:any) {
    return array1.filter((o:any) => array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.marketId) === selectionId
      }));
  }

  OtherAutoBullFancies(array1:any, array2:any) {
    return array1.filter((o:any) => array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.id) === selectionId
      }));
  }

  OtherAutoNeerajFancies(array1:any, array2:any) {
    return array1.filter((o:any) => array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.SelectionId) === selectionId
      }));
  }

  OtherAutoTigerFancies(array1:any, array2:any) {
    return array1.filter((o:any) => array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.id) === selectionId
      }));
  }

  OtherAutoFancies2(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ sid }:any) => {
        return this.makeFancy(sid) === o.selectionId
      }));
  }

  OtherAutoSkyFancies2(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ marketId }:any) => {
        return this.makeFancy(marketId) === o.selectionId
      }));
  }

  OtherAutoBullFancies2(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ id }:any) => {
        return this.makeFancy(id) === o.selectionId
      }));
  }

  OtherAutoNeerajFancies2(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ SelectionId }:any) => {
        return this.makeFancy(SelectionId) === o.selectionId
      }));
  }

  OtherAutoTigerFancies2(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ id }:any) => {
        return this.makeFancy(id) === o.selectionId
      }));
  }

  NewAutoSkFancies(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.sky_fancy_id) === selectionId
      }));
  }
  OtherAutoSkFancies(array1:any, array2:any) {
    return array1.filter((o:any) => array2.some(
      ({ selectionId }:any) => {
        return this.makeFancy(o.sky_fancy_id) === selectionId
      }));
  }

  OtherAutoSkFancies2(array1:any, array2:any) {
    return array1.filter((o:any) => !array2.some(
      ({ sky_fancy_id }:any) => {
        return this.makeFancy(sky_fancy_id) === o.selectionId
      }));
  }
  makeFancy(sid:any) {
    return this.result + '-' + sid + '.FY';
  }
  fcType(value:any) {
    return Object.values(value);
  }
  ngOnDestroy() {
    this.socket.destorySocket(this.result);
    if (this.oddsub) {
      this.oddsub.unsubscribe();
    }
    if (this.oddsub2) {
      this.oddsub2.unsubscribe();
    }
    if (this.autoFancyStatusSub) {
      this.autoFancyStatusSub.unsubscribe();
    }

    if (this.fancySub) {
      this.fancySub.unsubscribe();
    }
    clearTimeout(this.fancyTimeout);
    this.destroyed.next(void 0);
  }
  NewAutoSearchFancies(search:any) {
    return this.fancyList.filter((o:any )=> {
      return o.nat.toLowerCase().includes(search.toLowerCase())
    });
  }

  NewAutoSearchSkyFancies(search:any) {
    return this.fancyList.filter((o:any) => {
      return o.marketName.toLowerCase().includes(search.toLowerCase())
    });
  }

  NewAutoSearchBullFancies(search:any) {
    return this.fancyList.filter((o:any) => {
      return o.runner_name.toLowerCase().includes(search.toLowerCase())
    });
  }

  NewAutoSearchNeerajFancies(search:any) {
    return this.fancyList.filter((o:any) => {
      return o.RunnerName.toLowerCase().includes(search.toLowerCase())
    });
  }

  NewAutoSearchTigerFancies(search:any) {
    console.log("searchis",search)
    return this.fancyList.filter((o:any) => {
      return o.name.toLowerCase().includes(search.toLowerCase())
    });
  }
NewAutoSearchSkFancies(search:any) {
    return this.fancyList.filter((o:any) => {
      return o.runner_name.toLowerCase().includes(search.toLowerCase())
    });
  }
  searchFancy(e:any) {
    //this.destroyed.next();
    console.log("i am here",e.target.value)
    this.search = true;
    this.searchValue = e.target.value;
    //this.fancyScheduler();
  }

}
