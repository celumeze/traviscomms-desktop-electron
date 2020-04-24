import { CommonValidators } from '../common-validators/common-validators';

export class AccountHolder {
    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.emailAddress = '';
        this.company = '';
        this.subscriptionTypeId = CommonValidators.emptyGuid;
    }
    firstName: string;
    lastName: string;
    emailAddress: string;
    company: string;
    password: string;
    confirmPassword: string;
    subscriptionTypeId: string;
}
