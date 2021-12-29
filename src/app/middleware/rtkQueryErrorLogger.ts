import {
    MiddlewareAPI,
    isRejectedWithValue,
    Middleware,
} from '@reduxjs/toolkit';
import toastService from '../services/toastService';

export const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (isRejectedWithValue(action)) {
            if (action.payload.data && action.payload.data.message) {
                toastService.error(action.payload.data.message);
            } else {
                toastService.error('Unhandled error occured!');
            }
        }

        return next(action);
    };
