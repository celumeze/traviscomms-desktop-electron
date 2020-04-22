import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { SubscriptionType } from '../models/subscriptiontype';
import { Constants } from '../constants';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionTypeService {

  constructor(
    private _electron: ElectronService,
    private _httpClient: HttpClient) { }

  public getSubscriptionTypes(): Observable<SubscriptionType[]> {    
     const subscriptiontypes = from(this._httpClient.get<SubscriptionType[]>(Constants.apiRoot + "subscriptiontypes")
                 .toPromise());
       //this.updateSubscriptionTypes(subscriptiontypes); //for electron
      return subscriptiontypes;
  }

  //for iomic to electron update
  updateSubscriptionTypes(subscriptiontypes: Observable<SubscriptionType[]> = null)
  {
    const _subscriptiontypes = [];
    
    if(this._electron.isElectronApp) {
      subscriptiontypes.forEach(subscriptiontype => {
        _subscriptiontypes.push(subscriptiontype);
      });
      this._electron.ipcRenderer.send('subscriptiontypes', _subscriptiontypes);
    }
  }
           
}
