import IRole from './IRole';

interface ICountry {
    currencyCode: string;
    currencyName: string;
}
export default interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    countryId: string;
    languageId?: string;
    dateOfBirth: string;
    phoneNumber: string;
    phonePrefix: string;
    parentId?: string;
    Role: IRole;
    profileImage: string;
    childIds: string[];
    stripeCustomerId: string;
    stripeAccountId: string;
    stripeConnected: boolean;
    Country: ICountry;
    credits?: number;
    stripeVerifiedStatus?: string;
    stripeVerificationDeadline?: number;
    stripeVerificationDocumentsUploaded?: boolean;
    onboardingCompleted?: boolean;
}
