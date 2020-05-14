import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import {UserManager, User} from 'oidc-client';
import { Constants } from '../constants';
import { Subject } from 'rxjs';



@Injectable({providedIn: CoreModule})
export class AuthService {
    private _userManager: UserManager; //managers open id connect protocol details
    private _user: User;
    private _loginChangedSubject = new Subject<boolean>();

    loginChanged = this._loginChangedSubject.asObservable();

    constructor() {
        const idpSettings = {
          authority: Constants.idpServer,
          client_id: Constants.clientId,
          redirect_uri: `${Constants.clientRoot}signin-callback`,
          scope: 'openid profile traviscomms-api subscriptiontype accountholderrole',
          response_type: 'code',
          post_logout_redirect_uri: `${Constants.clientRoot}signout-callback`
        };

        this._userManager = new UserManager(idpSettings);
    }

    login() {
        return this._userManager.signinRedirect();
    }

    isLoggedIn(): Promise<boolean> {
        return this._userManager.getUser().then(user => {
            const currentUser = !!user && !user.expired;
            if(this._user !== user) {
                this._loginChangedSubject.next(currentUser);
            }
            this._user = user;
            return currentUser;
        })
    }
}
