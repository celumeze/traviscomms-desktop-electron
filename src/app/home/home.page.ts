import { Component, OnInit, Inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../core/auth-service.component';
import { CommonValidators } from '../common-validators/common-validators';
import { Constants } from '../constants';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private _loadingController: LoadingController,
              private _authService: AuthService, 
              @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit() {
  }

  async login() {
    const loading = await CommonValidators.presentLoadingForHomePage(this._loadingController);
    this._authService.login();
  }

  async goToSignUpPage() {
    const loading = await CommonValidators.presentLoadingForHomePage(this._loadingController);
    this._document.location.href = Constants.signupExternalUrl;
  }

}
