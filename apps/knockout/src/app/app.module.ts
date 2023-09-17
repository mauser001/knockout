import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/common/header/header.component';
import { Web3ConnectService } from './services/web3-connect.service';
import { TournamentListService } from './services/tournament-list.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HeaderComponent
  ],
  providers: [Web3ConnectService, TournamentListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
