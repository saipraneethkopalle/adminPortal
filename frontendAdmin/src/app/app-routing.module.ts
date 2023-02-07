import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent} from './dashboard/dashboard.component';
import { TennismatchesComponent } from './tennismatches/tennismatches.component';
import { HomeComponent } from './home/home.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { AddManualMatchComponent } from './add-manual-match/add-manual-match.component';
import { MActivitiesComponent } from './mactivities/mactivities.component';
import { LiveTvComponent } from './live-tv/live-tv.component';
import { WhitelistComponent } from './whitelist/whitelist.component';
import { SettingsComponent } from './settings/settings.component';
import { ServerStatusComponent } from './server-status/server-status.component';
import { UserlistComponent } from './userlist/userlist.component';
import { MessageComponent } from './message/message.component';
import { TennisComponent } from './tennis/tennis.component';
import { AddTennisFormComponent } from './add-tennis-form/add-tennis-form.component';
import { AddKabbadiComponent } from './add-kabbadi/add-kabbadi.component';
import { RolepageComponent } from './rolepage/rolepage.component';
import { SoccerComponent } from './soccer/soccer.component';
import { AddsoccerComponent } from './addsoccer/addsoccer.component';
import { AddsoccerformComponent } from './addsoccerform/addsoccerform.component';
import { FancyComponent } from './fancy/fancy.component';
import { SetlimitComponent } from './setlimit/setlimit.component';
import { ShowactivitiesComponent } from './showactivities/showactivities.component';
import { FancyactivitiesComponent } from './fancyactivities/fancyactivities.component';
import { ApiWhitelistComponent } from './api-whitelist/api-whitelist.component';
import { MarketlistComponent } from './marketlist/marketlist.component';
import { CricketlistComponent } from './cricketlist/cricketlist.component';
import { TennislistComponent } from './tennislist/tennislist.component';
import { SoccerlistComponent } from './soccerlist/soccerlist.component';
import { ShowEventsComponent } from './show-events/show-events.component';


const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'tennis', component:DashboardComponent},
  {path:'tennismatches',component:TennismatchesComponent},
  {path:'cricket', component:HomeComponent},
  {path:'addCricket', component:AddMatchComponent},
  {path:'addManualCricket', component:AddManualMatchComponent},
  {path:'mActivities', component:MActivitiesComponent},
  {path:'liveTv', component:LiveTvComponent},
  {path:'whitelist',component:WhitelistComponent},
  {path:'defaultSettings',component:SettingsComponent},
  {path:'serverStatus',component:ServerStatusComponent},
  {path:'userlist',component:UserlistComponent},
  {path:'message',component:MessageComponent},
  {path:'addTennis',component:TennisComponent},
  {path:'addManualTennis',component:AddTennisFormComponent},
  {path:'addManualKabaddi',component:AddKabbadiComponent},
  {path:'rolepage',component:RolepageComponent},
  {path:'soccer',component:SoccerComponent},
  {path:'addSoccer',component:AddsoccerComponent},
  {path:'addManualSoccer',component:AddsoccerformComponent},
  {path:`fancy/:id`,component:FancyComponent},
  {path:`setlimit/:id`,component:SetlimitComponent},
  {path:`match-activities/:id`,component:ShowactivitiesComponent},
  {path:`fancyactivities/:id/:selectionid`,component:FancyactivitiesComponent},
  {path:'apiwhiteList',component:ApiWhitelistComponent},
  {path:'listmarket',component:MarketlistComponent},
  {path:'cricketlist',component:CricketlistComponent},
  {path:'tennislist',component:TennislistComponent},
  {path:'soccerlist',component:SoccerlistComponent},
  {path:'showEvents/:id',component:ShowEventsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
