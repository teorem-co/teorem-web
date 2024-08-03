import INotification from '../../../../types/notification/INotification';

interface IGroupedNotifications {
    [date: string]: INotification[];
}

export default IGroupedNotifications;
