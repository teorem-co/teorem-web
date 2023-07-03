import {isRejectedWithValue, Middleware, MiddlewareAPI,} from '@reduxjs/toolkit';
import i18next from 'i18next';

import toastService from '../services/toastService';

export const rtkQueryErrorLogger: Middleware =
    (_api: MiddlewareAPI) => (next) => (action) => {
        if (isRejectedWithValue(action)) {
            if (action.payload.data && action.payload.data.message) {
                //this excludes toast erros on login enpoints
                if (action.meta.arg.endpointName !== 'login') {
                  console.log("rtkWuerry error logger");
                    toastService.error(i18next.t(action.payload.data.message));
                }
            } else {
              console.log("rtkQueryErrorLogger");
              toastService.error(i18next.t('ERROR_HANDLING.UNHANDLED_ERROR'));
            }
        }

        return next(action);
    };
