export enum NotificationType {
    BOOKING = 'BOOKING',
    CHAT_MISSED_CALL = 'CHAT_MISSED_CALL',
    DEFAULT = 'GENERAL',
}

interface INotification {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Date;
    read: boolean;
    type: NotificationType;
}

export default INotification;
