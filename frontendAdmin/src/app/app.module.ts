import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TennismatchesComponent } from './tennismatches/tennismatches.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AddMatchComponent } from './add-match/add-match.component';
import { AddManualMatchComponent } from './add-manual-match/add-manual-match.component';
import { MActivitiesComponent } from './mactivities/mactivities.component';
import { LiveTvComponent } from './live-tv/live-tv.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WhitelistComponent } from './whitelist/whitelist.component';
import { ServerStatusComponent } from './server-status/server-status.component';
import { SettingsComponent } from './settings/settings.component';
import { UserlistComponent } from './userlist/userlist.component';
import { MessageComponent } from './message/message.component';
import { TennisComponent } from './tennis/tennis.component';
import { AddTennisFormComponent } from './add-tennis-form/add-tennis-form.component';
import { AddKabbadiComponent } from './add-kabbadi/add-kabbadi.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RolepageComponent } from './rolepage/rolepage.component';
import { SoccerComponent } from './soccer/soccer.component';
import { AddsoccerComponent } from './addsoccer/addsoccer.component';
import { AddsoccerformComponent } from './addsoccerform/addsoccerform.component';
import { FancyComponent } from './fancy/fancy.component';
import { DatePipe } from '@angular/common';
import { SetlimitComponent } from './setlimit/setlimit.component';
import { ShowactivitiesComponent } from './showactivities/showactivities.component';
import { SearchFilterPipe } from './search-filter.pipe';
// import { BnNgIdleService } from 'bn-ng-idle';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FancyactivitiesComponent } from './fancyactivities/fancyactivities.component';
import { RemoveNegativeSignDirective } from './unless.directive';
import { ApiWhitelistComponent } from './api-whitelist/api-whitelist.component';
const config: SocketIoConfig = { url: 'http://localhost:7766', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TennismatchesComponent,
    HomeComponent,
    AddMatchComponent,
    AddManualMatchComponent,
    MActivitiesComponent,
    LiveTvComponent,
    WhitelistComponent,
    ServerStatusComponent,
    SettingsComponent,
    UserlistComponent,
    MessageComponent,
    TennisComponent,
    AddTennisFormComponent,
    AddKabbadiComponent,
    NavigationComponent,
    RolepageComponent,
    SoccerComponent,
    AddsoccerComponent,
    AddsoccerformComponent,
    FancyComponent,
    SetlimitComponent,
    ShowactivitiesComponent,
    FancyactivitiesComponent,
    SearchFilterPipe,
    RemoveNegativeSignDirective,
    ApiWhitelistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
