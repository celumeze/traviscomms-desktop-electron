import { ValidatorFn, AbstractControl } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

export class CommonValidators {
  public static textInputMatch(
    textInput1: string,
    textInput2: string,
  ): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const textInput1FormControl = c.get(textInput1);
      const textInput2FormControl = c.get(textInput2);

      if (textInput1FormControl.value === textInput2FormControl.value) {
        return null;
      }
      // tslint:disable-next-line:object-literal-key-quotes
      return { textInputMatch: true };
    };
  }

  public static checkPwdRequirement(isPasswordValid: boolean): ValidatorFn {
         return (c: AbstractControl): {[key: string]: boolean } | null => {
            if (c.pristine || c.value === '') {
                return null;
            }
            if (isPasswordValid) {
                return null;
            }
            return { invalidPassword: true };

         };
  }

  public static setValidationMessage(
    c: AbstractControl,
    validationMessagesObj: { [key: string]: string }
  ): string {
    if ((c.touched || c.dirty) && c.errors) {
      return Object.keys(c.errors)
        .map((key) => validationMessagesObj[key])
        .join(' ');
    }
  }

  ///for page loading spinner (Ionic)
  public static async presentLoading(loadingController: LoadingController): Promise<HTMLIonLoadingElement> {
    const loading = await loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    return loading;    
  }

  //for message

  //for displaying success toast message
  public static async showToaster(toastController: ToastController, message: string) {
    const toast = await toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
    }

    //error messages
    public static internalServerError: string = "An error occured. Please try again";
    public static emptyGuid = "00000000-0000-0000-0000-000000000000";
}
