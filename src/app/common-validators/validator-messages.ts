export class ValidatorMessages {
    public static getAccountFormValidationMessages(): {[key: string]: string} {
        const validationMessages = {
            email: 'Plese enter a valid email address\n',
            textInputMatch: 'Passwords do not match\n',
            invalidPassword: 'Should contain numbers, upper & lower case letters and symbols'
        };
        return validationMessages;
    } 
}
