import IRoleSelectionOption from '../../interfaces/IRoleSelectionOption';

export enum RoleSelectionEnum {
    Student = 0,
    Parent = 1,
    Tutor = 2,
}

export const roleSelectionOptions: IRoleSelectionOption[] = [
    {
        id: RoleSelectionEnum.Student,
        title: 'Student',
        description: 'Here to expand my knowledge.',
    },
    {
        id: RoleSelectionEnum.Parent,
        title: 'Parent / Guardian',
        description: 'Here to help my child learn.',
    },
    {
        id: RoleSelectionEnum.Tutor,
        title: 'Tutor',
        description: 'Here to teach students what I know.',
    },
];
