import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NewClient } from '../common/newclient';
import { SubscriptionType } from '../common/subscriptiontype';

function passwordCompare(c: AbstractControl): { [key: string]: boolean } | null {
  const passwordControl = c.get('password');
  const confirmPasswordControl = c.get('confirmPassword');

  if (passwordControl.value === confirmPasswordControl.value) {
  return null;
  }
  // tslint:disable-next-line:object-literal-key-quotes
  return { 'passwordMatch': true};
}

function subscriptionSelectionCheck(c: AbstractControl): { [key: string]: boolean } | null {
  const trialSubscriptionTypeControl = c.get('trialSubscriptionType');
  const paidSubscriptionTypeControl = c.get('paidSubscriptionType');

  if (trialSubscriptionTypeControl.value === true || paidSubscriptionTypeControl.value === true) {
    return null;
  }
  // tslint:disable-next-line:object-literal-key-quotes
  return { 'subscriptionCheck': true };
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      company: '',
      passwordGroup: this.fb.group({
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      }, { validators: passwordCompare }),
      subscriptionTypeGroup: this.fb.group({
        trialSubscriptionType: true,
        paidSubscriptionType: false
      }, { validators: subscriptionSelectionCheck })
    });
  }

  createAccount() {
    console.log(this.registerForm);
  }

  setSubscriptionType(selectedSubType: string) {
    if (selectedSubType === 'trial') {
      this.registerForm.controls.subscriptionTypeGroup.patchValue({
        paidSubscriptionType: false
      });
    } else {
      this.registerForm.controls.subscriptionTypeGroup.patchValue({
        trialSubscriptionType: false
      });
    }
  }

  populateSubscriptionTypes() {}
}
