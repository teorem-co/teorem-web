import i18next from 'i18next';
import { toast } from 'react-toastify';

class ToastService {
    private static opts: object = {
        autoClose: 3000,
        position: 'top-center',
        hideProgressBar: true,
    };

    private static notificationOpts: object = {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    success = (message: string): void => {
        toast.success(message, ToastService.opts);
    };

    error = (message: string): void => {
        const globalErrorMessage = message ? message : i18next.t('ERROR_HANDLING.UNHANDLED_ERROR');
        toast.error(globalErrorMessage, Object.assign({}, ToastService.opts, { toastId: 'errorId' }));
    };

    info = (message: string): void => {
        toast.info(message, Object.assign({}, ToastService.opts, { toastId: 'infoId' }));
    };

    notification = (message: string): void => {
        toast.warning(message, Object.assign({}, ToastService.notificationOpts, { toastId: 'notificationId' }));
    };
}

const toastService = new ToastService();

export default toastService;
