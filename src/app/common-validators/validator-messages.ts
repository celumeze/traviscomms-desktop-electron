export class ValidatorMessages {
    public static getRegFormValidationMessages(): {[key: string]: string} {
        const validationMessages = {
            email: 'Plese enter a valid email address\n',
            textInputMatch: 'Passwords do not match\n',
            invalidPassword: 'Alphanumeric, upper & lower case letters with symbols'
        };
        return validationMessages;
    }
}
