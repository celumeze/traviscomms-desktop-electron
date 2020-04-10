import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { NewClient } from '../common/newclient';
import { SubscriptionType } from '../common/subscriptiontype';
import { CommonValidators } from '../common-validators/common-validators';
import { ValidatorMessages } from '../common-validators/validator-messages';

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
  newClient = new NewClient();
  subscriptionTypes: SubscriptionType[] = [];

  emailValidationMessage: string;
  passwordMismatchMessage: string;
  invalidPasswordMessage: string;

  // output
  isPasswordValid = false;


  constructor(private fb: FormBuilder) {}

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
      subscriptionTypeGroup: this.fb.group(
        {
          trialSubscriptionType: true,
          paidSubscriptionType: false,
        },
        { validators: subscriptionSelectionCheck }
      ),
    });

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

  createAccount() {
    // console.log(this.registerForm);
  }

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

  passwordValid(event) {
    this.isPasswordValid = event;
    this.registerForm.get('passwordGroup.password').setValidators(CommonValidators.checkPwdRequirement(this.isPasswordValid));
    this.registerForm.get('passwordGroup.password').updateValueAndValidity();
  }

  populateSubscriptionTypes() {}
}
