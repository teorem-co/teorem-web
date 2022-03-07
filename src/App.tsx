import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useAppSelector } from './app/hooks';
import ROUTES, { RenderRoutes } from './app/routes';
import toastService from './app/services/toastService';
import ISocketNotification from './interfaces/notification/ISocketNotification';

function App() {
    const userId = useAppSelector((state) => state.auth.user?.id);
    const childIds = useAppSelector((state) => state.auth.user?.childIds);

    const socket = io('http://192.168.11.83:8000');
    useEffect(() => {
        // socket.on('connect', () => {
        //     console.log(`Connected with id : ${socket.id}`); // true
        // });

        socket.on('showNotification', (notification: ISocketNotification) => {
            const ifChildExists = childIds?.find((x) => x === notification.userId);
            if (userId && (notification.userId === userId || ifChildExists)) {
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
