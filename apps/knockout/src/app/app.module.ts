import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/common/header/header.component';
import { Web3ConnectService } from './services/web3-connect.service';
import { TournamentListService } from './services/tournament/tournament-list.service';
import { NgOptimizedImage } from '@angular/common'
import { ConnectButtonComponent } from './components/common/connect-button/connect-button.component';
import { MatCardModule } from '@angular/material/card';
import { DisclaimerComponent } from './components/common/disclaimer/disclaimer.component';
import { DebuggingService } from './services/debugging.service';
import { LogOverlayComponent } from './components/common/log-overlay/log-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ConnectButtonComponent,
    DisclaimerComponent,
    HeaderComponent,
    MatCardModule,
    NgOptimizedImage,
    LogOverlayComponent,
  ],
  providers: [
    DebuggingService,
    TournamentListService,
    Web3ConnectService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
