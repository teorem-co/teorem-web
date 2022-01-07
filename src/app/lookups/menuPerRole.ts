import { PATHS } from '../routes';
import { Role } from './role';

interface IMenuItem {
    name: string;
    icon: string;
    key: string;
    path: string;
}

interface IMenuPerRole {
    [key: string]: IMenuItem[];
}

export const menuPerRole: IMenuPerRole = {
    [Role.Tutor]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
    ],
    [Role.Student]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
    ],
    [Role.Parent]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
    ],
    [Role.SuperAdmin]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
    ],
};
