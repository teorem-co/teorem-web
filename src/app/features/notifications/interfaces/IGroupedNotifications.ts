import INotification from '../../../../interfaces/notification/INotification';

interface IGroupedNotifications {
    [date: string]: INotification[];
}

export default IGroupedNotifications;
