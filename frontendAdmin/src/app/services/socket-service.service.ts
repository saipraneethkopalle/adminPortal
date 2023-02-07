import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  private url = environment.url;
  private socket;
  private message: string | undefined;
  private messageUpdated = new Subject<{ message: any }>();
  private message2: string | undefined;
  private messageUpdated2 = new Subject<{ message2: any }>();
  private fancyMessage: string | undefined;
  private fancyUpdated = new Subject<{ message: any }>();

  private centralCounter: string | undefined;
  private centralCounterUpdated = new Subject<{ centralCounter: any }>();

  private scoreCounter: string | undefined;
  private scoreCounterUpdated = new Subject<{ scoreCounter: any }>();
  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket']
    });
   }
   public setOdds = (eventId:any) => {
    this.socket.emit('Event/Auto', eventId);
  }

  public getOdds = (eventId:any) => {
    this.socket.on('Event/Auto/' + eventId, (message) => {
      // console.log("message",message);
      this.message = message;
      this.messageUpdated.next({
        message: this.message
      });
    });
  }
  getUpdateMessageListner() {
    return this.messageUpdated.asObservable();
  }
  public setBookMaker = (eventId:any) => {
    this.socket.emit('Fancy/Auto', eventId);
    this.socket.emit('BookM/Auto', eventId);
  }

  public getBookMaker = (eventId:any) => {
    this.socket.on('BookM/Auto/' + eventId, (message) => {
      // console.log("messagebook",message);
      this.message2 = message;
      this.messageUpdated2.next({
        message2: this.message2
      });
    });
  }
  getUpdate2MessageListner() {
    return this.messageUpdated2.asObservable();
  }
  public setFancy = (eventId:any) => {
    console.log("send event",eventId);
    this.socket.emit('Fancy/Auto', eventId);
  }
  public getFancy = (eventId:any) => {
    this.socket.on('Fancy/Auto/'+eventId,(message)=>{
      // console.log("mes",message);
      this.fancyMessage = message;
      this.fancyUpdated.next({
        message: this.fancyMessage
      });
    });
  }
  getFancyUpdateMessageListner() {
    return this.fancyUpdated.asObservable();
  }

  public setCC = () => {
    this.socket.emit('stats', '');
  }

  public getCC = () => {
    this.socket.on('stats', (message) => {
      this.centralCounter = message;
      this.centralCounterUpdated.next({
        centralCounter: this.centralCounter
      });
    });
  }
  getUpdateCentralListner() {
    return this.centralCounterUpdated.asObservable();
  }

  getUpdateScoreListner() {
    return this.scoreCounterUpdated.asObservable();
  }
  public destorySocket = (eventId:any) => {
    this.socket.off('Event/Auto/' + eventId);
    this.socket.off('Fancy/Auto/' + eventId);
    this.socket.off('BookM/Auto/' + eventId);
    this.socket.emit('destroy_room');
  }
}
