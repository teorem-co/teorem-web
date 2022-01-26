import IRole from './IRole';

interface IFile {
    path: string;
}

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
    Role?: IRole;
    File?: IFile;
}
