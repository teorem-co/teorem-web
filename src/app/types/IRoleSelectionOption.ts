import { RoleSelectionEnum } from '../constants/roleSelectionOptions';

export default interface IRoleSelectionOption {
    id: RoleSelectionEnum;
    title: string;
    description: string;
}
