import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useAppSelector } from './app/hooks';
import ROUTES, { RenderRoutes } from './app/routes';
import toastService from './app/services/toastService';
import ISocketNotification from './interfaces/notification/ISocketNotification';

function App() {
    const userId = useAppSelector((state) => state.auth.user?.id);

    useEffect(() => {
        const socket = io('http://192.168.11.145:3001');
        socket.on('connect', () => {
            console.log(`Connected with id : ${socket.id}`); // true
        });

        socket.on('showNotification', (notification: ISocketNotification) => {
            if (userId && notification.userId === userId) {
                toastService.success(notification.description);
            }
        });

        return function disconnectSocket() {
            socket.disconnect();
        };
    }, []);

    return <RenderRoutes routes={ROUTES} />;
}

export default App;
