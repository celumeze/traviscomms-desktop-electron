import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResponseMessage } from '../models/responsemessage';
import { CommonValidators } from '../common-validators/common-validators';
import { ValidatorMessages } from '../common-validators/validator-messages';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
loginForm: FormGroup;
responseMessage = new ResponseMessage();
emailValidationMessage: string;
invalidPasswordMessage: string;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  

  //validation watchers
  const emailFormControl = this.loginForm.get('emailAddress');

  emailFormControl.valueChanges.subscribe((value) => {
      this.emailValidationMessage =
      CommonValidators.setValidationMessage(emailFormControl, ValidatorMessages.getAccountFormValidationMessages());
  }); 
 
  }


  //login
  login() {

  }

}
