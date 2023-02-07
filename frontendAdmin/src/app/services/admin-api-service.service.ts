import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import {  ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const BACKEND_URL_NEW247 = 'http://NEW247.co/api/';
const BACKEND_URL_INDIA247 = 'http://indiabets247.com/api/';
const BACKEND_URL_WOLFS = 'http://wolfs99.com/api/';
const BACKEND_URL_HALKA = 'http://halkabhari.com/api/';
const BACKEND_URL_65BET = 'http://bsf77.co/api/';
const BACKEND_URL_BETX1 = 'http://betx1.in/api/';
@Injectable({
  providedIn: 'root'
})
export class AdminApiServiceService {
  private isAuthenticated = false;
  token:any;
  private tokenTimer: any;
  userId: any;
  userName: any;
  email: any ;
  level: any;
  private error = '';
  private fancy: any = [];
  private autoFancyStatus: any = [];
  private fancyActivities: any = [];
  domains:any =localStorage.getItem("domains");
  private fancyActivitiesUpdated = new Subject<{ fancyActivities: any[] }>();
  private fancyUpdated = new Subject<{ fancy: any[] }>();
  private autoFancyStatusUpdated = new Subject<{ autoFancyStatus: any[] }>();
  headers:any = {'authorization':localStorage.getItem("token") };
  isLogin:boolean=false;
  user = localStorage.getItem("user")
  loginstatus = new BehaviorSubject("");
  private authStatusListner = new Subject<boolean>();
  link =environment.url;
  constructor(private http: HttpClient,private router:Router) {
   }
   getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }


  getUserEmail() {
    return this.email;
  }
   setLoginStatus(value:any) {
    this.loginstatus.next(value);
  }
  getLoginStatus() {
    return this.loginstatus.asObservable();
  }
  login(username: any, password: any) {
    const authData = { username: username, password: password };
    this.http.post<{ token: string, expiresIn: number, id: string, name: string, username: string, level: string, response: any }>(
      this.link + "/api/beforelogin/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.id;
          this.userName = response.username;
          this.level = response.level;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          //console.log(expirationDate);
          // this.setDomain(domains);
          this.saveAuthData(token, expirationDate, this.userId, this.userName, this.level);
          this.router.navigate(['/tennis']);
        }
      }, error => {
        this.error = error.error.message;
        console.log("error",error);
        this.authStatusListner.next(false);
      });
  }

  getError() {
    return this.error;
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userName = authInformation.userName;
      this.level = authInformation.level;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.level = null;
    this.authStatusListner.next(false);
    clearInterval(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.userName = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting Timer " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userName: string,  level: string) {
    // console.log("saving",token, expirationDate, this.userId, this.userName, this.level)
    localStorage.setItem('token', token);
    this.headers.authorization =localStorage.getItem('token');
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('user', userName);
    localStorage.setItem('level', level);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    localStorage.removeItem('level');
    localStorage.removeItem('domains');
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("user");
    const level = localStorage.getItem("level");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName,
      level: level
    }
  }
  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }
  adminLogin(data:any) {
    const url = `${this.link}/api/beforelogin/login`;
    return this.http.post(url,data)
  }
  getUserLevel(){
    return localStorage.getItem("level");
  }
   addManualMatch(data:any){
    const user = localStorage.getItem("user");
    data.createdBy = user
    const url = `${this.link}/api/v1/addMatch`
    return this.http.post(url,data,{headers:this.headers})
  }
  getManualMatch(){
    const url = `${this.link}/api/v1/getMatches`;
    return this.http.get(url,{headers:this.headers});
  }
  getMatches() {
    const url = `${this.link}/api/v1/getMatches`;
    return this.http.get(url,{headers:this.headers});
  }
  getMatchBySport(data:any) {
    const url = `${this.link}/api/v1/getMatchBySports/${data}`;
    return this.http.get(url,{headers:this.headers})
  }

  updateHeader(data:any){
    // const url = `${this.link}/api/v1/updateHeadersCricket`;
    // return this.http.post(url,data,{headers:this.headers})
      // const response1 = this.http.post(BACKEND_URL_NWVIP + 'updateBookMakerHeader', data);
      // const response2 = this.http.post(BACKEND_URL_BETX365 + 'updateBookMakerHeader', data);
      // const response3 = this.http.post(BACKEND_URL_NAYALUDU + 'updateBookMakerHeader', data);
      // const response4 = this.http.post(BACKEND_URL_TENSPORTS + 'updateBookMakerHeader', data);
      // return forkJoin([response1, response2, response3, response4]);

      let responses = [];
      for (let dm of this.domains) {
        responses.push(this.http.post(dm.domain + '/api/updateBookMakerHeader', data));
      }
      return forkJoin(responses);

  }

  getUsers(){
    const url = `${this.link}/api/v1/getUsers`
    return this.http.get(url,{headers:this.headers})
  }
  addUsers(data:any){
    const url = `${this.link}/api/v1/adduser`
    return this.http.post(url,data,{headers:this.headers})
  }
  addWebsite(data:any){
    const url = `${this.link}/api/v1/addWhitelistWebsite`
    return this.http.post(url,data,{headers:this.headers})
  }
  getWhitelist(){
    const url=`${this.link}/api/v1/getAllWebsite`
    return this.http.get(url,{headers:this.headers})
  }
  deleteWhiteList(data:any) {
    const url =  `${this.link}/api/v1/deleteWebsite/${data}`
    return this.http.delete(url,{headers:this.headers});
  }
  getWebsiteBySports(data:any){
    console.log(data);
    const url = `${this.link}/api/v1/getMatchBySports/${data.sports}`
    return this.http.get(url,{headers:this.headers})
  }
  updateUser(data:any){
    const url = `${this.link}/api/v1/updateUser`
    return this.http.post(url,data,{headers:this.headers})
  }
  getMatchBySportName(data:any){
    const url = `${this.link}/api/v1/getLatestData/${data.sports}`;
    return this.http.get(url,{headers:this.headers});
  }

  addMatch(data:any) {
    const url = `${this.link}/api/v1/updateMatch`;
    return this.http.put(url,data,{headers:this.headers});
  }
  getEvents() {
    const url = `${this.link}/api/v1/getEvents`;
    return this.http.get(url,{headers:this.headers});
  }
   getEventsBySports(data:any) {
    const url = `${this.link}/api/v1/getEventsBySportName`;
    return this.http.post(url,data,{headers:this.headers})
  }
  removeMatchBySports(data:any,value:any) {
    // const user  = localStorage.getItem("user");
    value.createdBy = this.user;
    const url = `${this.link}/api/v1/removeMatchBySports/${data.eventId}/${data.Sport}`;
    return this.http.patch(url,value,{headers:this.headers})
  }
  rollBackMatchRedis(data:any,value:any) {
    value.createdBy = this.user;
    const url = `${this.link}/api/v1/rollBackMatch/${data}`;
    return this.http.patch(url,value,{headers:this.headers});
  }
  updateProvider(data:any){
    data.createdBy = this.user;
    console.log("i came here",data)
    const url = `${this.link}/api/v1/updateProvider`
    return this.http.post(url,data,{headers:this.headers})
  }
  addProviderSettings(data:any){
    data.createdBy = this.user;
    const url = `${this.link}/api/v1/addDefaultSettings`
    return this.http.post(url,data,{headers:this.headers})
  }
  getProviderSettings() {
    const url = `${this.link}/api/v1/getDefaultSettings`;
    return this.http.get(url,{headers:this.headers});
  }
  deleteMatchByEId(data:any){
    const url = `${this.link}/api/v1/removeMatch/${data.event_id}`;
    return this.http.get(url,{headers:this.headers})
  }
  getRemovedData() {
    const url = `${this.link}/api/v1/getRemovedData`;
    return this.http.get(url,{headers:this.headers});
  }
  getRemovedDataBySport(data:any) {
    const url = `${this.link}/api/v1/getRemovedDataBySportsName/${data}`;
    return this.http.get(url,{headers:this.headers})
  }
  getEventDetail(event_id:any){
    const url = `${this.link}/api/v1/getEventDetail/${event_id}`;
    return this.http.get(url,{headers:this.headers})
  }
  updateUrl(data:any){
    const url = `${this.link}/api/v1/updateUrl`;
    return this.http.post(url,data,{headers:this.headers})
  }
  addSetLimitData(marketId:any,data:any){
    const { sites, oddsMin, oddsMax, oddsProfitLoss, bookMin, bookMax, bookProfitLoss, fancyMin, fancyMax, fancyProfitLoss } = data;
    const finaldata = { marketId, oddsMin, oddsMax, oddsProfitLoss, bookMin, bookMax, bookProfitLoss, fancyMin, fancyMax, fancyProfitLoss };
    // const url = `${this.link}/api/v1/addSetLimit`;
    // return this.http.post(url,data,{headers:this.headers})
    if (data.sites == 'all') {
      let responses = [];
      for (let dm of this.domains) {
        responses.push(this.http.post(dm.domain + '/api/setCentralMinMaxBet', finaldata));
      }
      return forkJoin(responses);
    }
    else {
      return this.http.post(data.sites + '/api/setCentralMinMaxBet', finaldata);
    }
  }
  getSetLimit(eventId:any){
    const url = `${this.link}/api/v1/getSetLimit/${eventId}`;
    return this.http.get(url,{headers:this.headers})
  }
  addFancData(){
    const url = `${this.link}/api/v1/addFancyDetails`;
    return this.http.post(url,'',{headers:this.headers})
  }
  getRemoveFancy(data:any){
    const url = `${this.link}/api/v1/inactiveFancy`;
    return this.http.post(url,data,{headers:this.headers})
  }
  getInactive(){
    const url = `${this.link}/api/v1/getInactiveFancy`;
    return this.http.get(url,{headers:this.headers})
  }
  getActiveFancy(data:any){
    const url = `${this.link}/api/v1/activeFancy`;
    return this.http.post(url,data,{headers:this.headers})
  }
  getLayBackData(data:any) {
    const url = `${this.link}/api/v1/getLayBackDetailsByMarketId`;
    return this.http.post(url,data,{headers:this.headers});
  }
  closeFancyItem(data:any){
    const url = `${this.link}/api/v1/closeFancy`;
    return this.http.post(url,data,{headers:this.headers})
  }
  changeactiveAll(data:any){
    const url = `${this.link}/api/v1/changeactiveAll`;
    return this.http.post(url,data,{headers:this.headers})
  }
  getMatchActivities(eventId:any, type:any) {
    const url = `${this.link}/api/v1/getMatchesActivities/${eventId}?type=${type}`
    return this.http.get(url,{headers:this.headers})

  }
getCmpt(id:any){
  const url = 'http://178.79.154.77/test/api/listcompetition.php?id='+id;
  return this.http.get(url)
}
getEventsById(id:any){
  const url = 'http://178.79.154.77/test/api/listevent.php?id='+id;
  return this.http.get(url)
}
getEventsCount(id:any){
  const url = 'http://178.79.154.77/test/api/allevent.php?id='+id;
  return this.http.get(url)
}
getUpdateFancyListner() {
  return this.fancyUpdated.asObservable();
}
getUpdateFancyActivitiesListner() {
  return this.fancyActivitiesUpdated.asObservable();
}
getAutoUpdateFancyStatusListner() {
  return this.autoFancyStatusUpdated.asObservable();
}
activeAllFancy(data:any, logs:any, eventId:any) {
  const url = `${this.link}/api/v1/changeactiveAll`;
  const sdata = { data: data, logs: logs, eventId: eventId };
  return this.http.post(url,sdata,{headers:this.headers})
}
getFancy(id:any, marketId:any, provider:any, status:any) {
  const queryParam = `?marketId=${marketId}&provider=${provider}`;
  let queryParams1;
  if (status == 'All') {
    queryParams1 = `?eventId=${id}&provider=${provider}`;
  }
  else {
    queryParams1 = `?eventId=${id}&status=${status}&provider=${provider}`;
  }
  const url1=this.link + '/api/v1/getProviderFancy' + queryParam
  const url2 = this.link + '/api/v1/getFancyByStatus' + queryParams1
  const res1 = this.http.get( url1,{headers:this.headers});
  const res2 = this.http.get(url2,{headers:this.headers});
  forkJoin([res1, res2]).subscribe((transformedFancyData) => {
    //console.log(transformedFancyData);
    this.fancy = transformedFancyData[0];
    this.fancyUpdated.next({
      fancy: { ...this.fancy }
    });
    // console.log("tf",transformedFancyData[1])
    this.autoFancyStatus = transformedFancyData[1];
    if(this.autoFancyStatus.length > 0){
    this.autoFancyStatusUpdated.next({
      autoFancyStatus: this.autoFancyStatus
    });
  }else{
    this.autoFancyStatusUpdated.next({
      autoFancyStatus:[]
    });
  }
  });
}
getAllActive(data:any){
  const url = `${this.link}` + '/api/v1/getAllActive';
  return this.http.post(url,data,{headers:this.headers})
}
setFancyStatus(status:any, eventId:any, selectionId:any, name:any, provider:any, marketId:any, runnerId:any, runners:any, type:any,createdBy:any) {
  let queryParams;
  let params = JSON.stringify(runners);
  if (status == 'Active') {
    queryParams = `?fancyid=${selectionId}&eventid=${eventId}&provider=${provider}`;
  }
  if (status != 'Active') {
    queryParams = `?id=${selectionId}`;
  }

  const data = {
    status, eventId, selectionId, name, provider, runnerId, runners, type,createdBy
  };

  return this.http.post(this.link + '/api/v1/setFancyStatus', data,{headers:this.headers});
}
setResult(input:any, eventId:any, selectionId:any, name:any,createdBy:any) { // use
  console.log("closed payload",input, eventId, selectionId, name,createdBy);
  const data = { id: selectionId, eventid: eventId, winner: input, name: name, type: 'Fancy',createdBy:createdBy };
  const response1 = this.http.post(this.link + '/api/v1/closeFancy', data,{headers:this.headers});
  return response1;
}

setFancy1Result(input:any, eventId:any, selectionId:any, name:any,createdBy:any) { // use
  const data = { id: selectionId, eventid: eventId, winner: input, name: name, type: 'fancy1',createdBy:createdBy };
  const response1 = this.http.post(this.link + '/api/v1/closeFancy', data,{headers:this.headers});
  return response1;

}
setResultRollback(eventId:any, selectionId:any) { // use
  let data = { id: selectionId, eventId,createdBy:this.user };
  const data1 = `?fancyid=${selectionId}`;
  // data['createdBy'] = this.user
  const response1 = this.http.post(this.link + '/api/v1/rollbackFancy', data,{headers:this.headers});

  // const domain = this.userService.getDomain();
  // let responses = [];
  // for (let dm of domain) {
  //   responses.push(this.http.post(dm.domain + '/api/rollbackCommonFancyResult' + data1, {}));
  // }
  return response1;
}

setFancy1ResultRollback(eventId:any, selectionId:any) { // use
  const data = { id: selectionId, eventId };
  const data1 = `?fancyid=${selectionId}`;
  const response1 = this.http.post(this.link + '/api/v1/rollbackFancy', data,{headers:this.headers});

  let responses = [];
  for (let dm of this.domains) {
    responses.push(this.http.post(dm.domain + '/api/rollbackCommonFancy1Result' + data1, {}));
  }
  return response1;
}

getFancyActivities(eventId:any, selectionId:any) {  // use
  this.http.get(this.link + '/api/v1/getFancyActivities/' + eventId + '/' + selectionId,{headers:this.headers}).subscribe((response:any) => {
    //console.log(response);
    this.fancyActivities = response;
    this.fancyActivitiesUpdated.next({
      fancyActivities: this.fancyActivities.length > 0 ? [...this.fancyActivities]:this.fancyActivities
    });
  });
}

getUpdateFancyActivitiesListener() { // use
  return this.fancyActivitiesUpdated.asObservable();
}
tAllow(allow:any) { // use
  let data = { allow };
  return this.http.post('https://premiumfancy.centralredis.in/api/fancy/setAllow', data);
}

rAllow(allow:any) { // use
  let data = { allow };
  return this.http.post('https://ryanpremium.centralredis.in/api/fancy/setAllow', data);
}

setMessage(data:any) { // use
  const response1 = this.http.post(BACKEND_URL_NEW247 + 'setCommonMessage', data);
  const response2 = this.http.post(BACKEND_URL_INDIA247 + 'setCommonMessage', data);
  const response3 = this.http.post(BACKEND_URL_65BET + 'setCommonMessage', data);
  const response4 = this.http.post(BACKEND_URL_BETX1 + 'setCommonMessage', data);
  const response5 = this.http.post(BACKEND_URL_WOLFS + 'setCommonMessage', data);
  const response6 = this.http.post(BACKEND_URL_HALKA + 'setCommonMessage', data);

  return forkJoin([response1, response2, response3, response4, response5, response6]);
}

getProcess(){
  const url = `${this.link}/api/v1/getProcess`;
    return this.http.get(url,{headers:this.headers})
}

matchSettings(data:any) {
  const url = `${this.link}/api/v1/updateMatchSettings`;
  return this.http.put(url,data,{headers:this.headers})

}
getMatchSettings() {
  const url = `${this.link}/api/v1/getMatchSettings`;
  return this.http.get(url,{headers:this.headers})

}
}

