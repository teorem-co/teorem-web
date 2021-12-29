export default interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordResetToken: string;
    password: string;
    roleId: string;
    countryId: string;
    dateOfBirth: string;
    phoneNumber: string;
    phonePrefix: string;
    parentId?: string;
}
