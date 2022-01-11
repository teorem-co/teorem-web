import IRole from './IRole';

export default interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    countryId: string;
    dateOfBirth: string;
    phoneNumber: string;
    phonePrefix: string;
    parentId?: string;
    role?: IRole;
}
