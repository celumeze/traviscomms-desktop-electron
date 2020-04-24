import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AccountHolder } from '../models/accountholder';
import { SubscriptionType } from '../models/subscriptiontype';
import { CommonValidators } from '../common-validators/common-validators';
import { ValidatorMessages } from '../common-validators/validator-messages';
import { SubscriptionTypeService } from '../subscriptiontypes/subscriptiontype.service';
import { Utils } from '../core/utils';
import { RegisterService } from './register.service';
import { ResponseMessage } from '../models/responsemessage';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

function subscriptionSelectionCheck(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const trialSubscriptionTypeControl = c.get('trialSubscriptionType');
  const paidSubscriptionTypeControl = c.get('paidSubscriptionType');

  if (
    trialSubscriptionTypeControl.value === true ||
    paidSubscriptionTypeControl.value === true
  ) {
    return null;
  }
  // tslint:disable-next-line:object-literal-key-quotes
  return { subscriptionCheck: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  newAccountHolder = new AccountHolder();
  subscriptionTypes: SubscriptionType[] = [];
  responseMessage = new ResponseMessage();

  emailValidationMessage: string;
  passwordMismatchMessage: string;
  invalidPasswordMessage: string;

  // output
  isPasswordValid = false;


  constructor(private fb: FormBuilder, 
              private _subscriptionTypeService: SubscriptionTypeService,
              private _registerService: RegisterService,
              private _loadingController: LoadingController,
              private _toastController: ToastController) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      company: '',
      passwordGroup: this.fb.group(
        {
          password: ['', [Validators.required, CommonValidators.checkPwdRequirement(this.isPasswordValid)]],
          confirmPassword: ['', Validators.required],
        },
        {
          validators: CommonValidators.textInputMatch(
            'password',
            'confirmPassword'
          ),
        }
      ),
      subscriptionTypeGroup: this.buildSubscriptionTypes()     
    });

    //get available subscription types
    this._subscriptionTypeService.getSubscriptionTypes().subscribe(
      subscriptionTypes => {
      this.subscriptionTypes = subscriptionTypes;
      this.updateSubscriptionTypeIds();
    }, 
    error => Utils.formatError(error));

    // validation watcher
    const emailFormControl = this.registerForm.get('emailAddress');
    const confirmPasswordFormControl = this.registerForm.get('passwordGroup');
    const passwordFormControl = this.registerForm.get('passwordGroup.password');

    emailFormControl.valueChanges.subscribe((value) => {
        this.emailValidationMessage =
        CommonValidators.setValidationMessage(emailFormControl, ValidatorMessages.getRegFormValidationMessages());
    });
    confirmPasswordFormControl.valueChanges.subscribe((value) => {
      this.passwordMismatchMessage =
      CommonValidators.setValidationMessage(confirmPasswordFormControl, ValidatorMessages.getRegFormValidationMessages());
  });
    passwordFormControl.valueChanges.subscribe((value) => {
      this.invalidPasswordMessage =
      CommonValidators.setValidationMessage(passwordFormControl, ValidatorMessages.getRegFormValidationMessages());
  });
  }
 


  //////Functions

  //submit registration form
  async createAccount() {
    if(this.registerForm.dirty && this.registerForm.valid) {

      let accountHolder = Object.assign({}, this.newAccountHolder, this.registerForm.value);
      accountHolder = this.buildAccountHolderValue(accountHolder);   
      const loading = await CommonValidators.presentLoading(this._loadingController); 

      this._registerService.registerAccountHolder(accountHolder).subscribe(
      async message => await this.onCreateAccountComplete(message, loading),
      async error => await this.onCreateAccountError(error, loading));      
    }    
  }

  //update subscription types when a selection is made
  //to allow only one is selected at a time from form
  setSubscriptionType(selectedSubType: string) {
    if (selectedSubType === 'trial') {
      this.registerForm.get('subscriptionTypeGroup').patchValue({
        paidSubscriptionType: false,
      });
    } else {
      this.registerForm.controls.subscriptionTypeGroup.patchValue({
        trialSubscriptionType: false,
      });
    }
  }

  //update subscription type id when http get is complete
  updateSubscriptionTypeIds() {
    this.subscriptionTypes.forEach(subscriptionType => {      
       if(subscriptionType.price > 0) {
        this.registerForm.get('subscriptionTypeGroup').patchValue({
          paidSubscriptionId: subscriptionType.subscriptionTypeId,    
        });
       } else {          
        this.registerForm.get('subscriptionTypeGroup').patchValue({
          trialSubscriptionId: subscriptionType.subscriptionTypeId,    
        });
       }
    });
   
  }

  //for password strength indicator
  passwordValid(event) {
    this.isPasswordValid = event;
    this.registerForm.get('passwordGroup.password').setValidators(CommonValidators.checkPwdRequirement(this.isPasswordValid));
    this.registerForm.get('passwordGroup.password').updateValueAndValidity();
  }

  //set object to submit to form
  buildAccountHolderValue(_accountHolder: AccountHolder): AccountHolder {
    if(this.registerForm.get('subscriptionTypeGroup.trialSubscriptionType').value) {
      _accountHolder.subscriptionTypeId = this.registerForm.get('subscriptionTypeGroup.trialSubscriptionId').value;
    } else {
      _accountHolder.subscriptionTypeId = this.registerForm.get('subscriptionTypeGroup.paidSubscriptionId').value;
    }
    _accountHolder.password = this.registerForm.get('passwordGroup.password').value;
    _accountHolder.confirmPassword = this.registerForm.get('passwordGroup.confirmPassword').value;
    return _accountHolder;
  }

  //initialize subscription type values
  buildSubscriptionTypes(): FormGroup {
    return this.fb.group(
      {
        trialSubscriptionType: true,
        trialSubscriptionId: CommonValidators.emptyGuid,
        paidSubscriptionType: false,
        paidSubscriptionId: CommonValidators.emptyGuid
      },
      { validators: subscriptionSelectionCheck }
    );
  }

  //complete create account
  onCreateAccountComplete(message: ResponseMessage, loading: HTMLIonLoadingElement) {
    this.responseMessage = message;
    CommonValidators.showToaster(this._toastController, this.responseMessage.successMessage); 
    this.registerForm.patchValue({
      firstName: '',
      lastName: '',
      emailAddress: null,
      passwordGroup: { password: '', confirmPassword: '' },
      paidSubscriptionType: false,    
      trialSubscriptionType: true
    });
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
    loading.dismiss();
  }

  //complete create account hhtp response error
  async onCreateAccountError(error: any, loading: HTMLIonLoadingElement) {
    if(error instanceof HttpErrorResponse)
      if(error.error.errorMessage) {
        this.responseMessage.errorMessage = error.error.errorMessage; 
      }
      else {
        this.responseMessage.errorMessage = CommonValidators.internalServerError;
      }
    await document.querySelector('ion-content').scrollToTop(500);
    loading.dismiss();
  }

  //close error message alert
  closeErrorAlert() {
    this.responseMessage.errorMessage = '';
  }

}
