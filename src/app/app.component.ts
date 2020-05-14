import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './core/auth-service.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{
  isLoggedIn = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _authService: AuthService
  ) 
  {
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });    
    this.initializeApp();
  }
  ngOnInit(): void {
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
