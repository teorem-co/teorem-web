interface INotification {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Date;
    isRead: boolean;
}

export default INotification;
