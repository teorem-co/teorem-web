import IRole from './IRole';

export default interface IUser {
    id: string;
    fullName: string;
    email: string;
    resetPasswordToken: string;
    dateCreated: string;
    password: string;
    roleId: string;
    companyId: string;
    role?: IRole;
};