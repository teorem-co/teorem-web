import i18next from 'i18next';
import { toast } from 'react-toastify';

class ToastService {
    private static opts: object = {
        autoClose: 3000,
        position: 'bottom-center',
        hideProgressBar: true,
    };

    private static notificationOpts: object = {
        position: 'top-right',
        autoClose: 10000,
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
        const customToast: JSX.Element = (
            <div className="Toastify--custom">
                <div className="Toastify--custom__icon">
                    <i className="icon icon--base icon--calendar icon--white"></i>
                </div>
                <div className="Toastify--custom__message">{message}</div>
            </div>
        );
        toast.warning(customToast, Object.assign({}, ToastService.notificationOpts));
    };
}

const toastService = new ToastService();

export default toastService;
