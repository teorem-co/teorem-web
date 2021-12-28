import { RoleSelectionEnum } from "../app/constants/roleSelectionOptions";

export default interface IRoleSelectionOption {
    id: RoleSelectionEnum;
    title: string;
    description: string;
};