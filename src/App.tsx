import moment from 'moment';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useAppSelector } from './app/hooks';
import ROUTES, { RenderRoutes } from './app/routes';
import toastService from './app/services/toastService';
import ISocketNotification from './interfaces/notification/ISocketNotification';

function App() {
    const userId = useAppSelector((state) => state.auth.user?.id);
    const childIds = useAppSelector((state) => state.auth.user?.childIds);
    const serverUrl = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`;
    const socket = io(serverUrl);

    useEffect(() => {
        // socket.on('connect', () => {
        //     console.log(`Connected with id : ${socket.id}`); // true
        // });

        socket.on('showNotification', (notification: ISocketNotification) => {
            const ifChildExists = childIds?.find((x) => x === notification.userId);
            if (userId && (notification.userId === userId || ifChildExists)) {
                notification.description = notification.description.replace(/date=\{(.*?)\}/g, function (match, token) {
                    return moment(new Date(token)).format('HH:mm, DD/MMM/YYYY');
                });
                toastService.notification(notification.description);
            }
        });

        return function disconnectSocket() {
            socket.disconnect();
        };
    }, []);

    return <RenderRoutes routes={ROUTES} />;
}

export default App;
