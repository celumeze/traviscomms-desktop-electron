export class ValidatorMessages {
    public static getRegFormValidationMessages(): {[key: string]: string} {
        const validationMessages = {
            email: 'Plese enter a valid email address\n',
            textInputMatch: 'Passwords do not match\n',
            invalidPassword: 'Should contain numbers, upper & lower case letters and symbols'
        };
        return validationMessages;
    }
}
