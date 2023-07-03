import i18next, { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';

import ToastFreeConsultationMessage from '../components/ToastFreeConsultationMessage';
import { IState, setActiveChatRoom, setFreeConsultation, setLink } from '../features/chat/slices/chatSlice';
import { useAppSelector } from '../hooks';
import { PATHS, PROFILE_PATHS } from '../routes';

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

    private static freeConsultationOpts: object = {
        position: 'top-right',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    };

    success = (message: string): void => {
        toast.success(message, ToastService.opts);
    };

    error = (message: string): void => {
        const globalErrorMessage = message ? message : i18next.t('ERROR_HANDLING.UNHANDLED_ERROR');
        console.log(message);
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

    freeConsultation = (buffer: any, accept: () => void, deny: () => void): React.ReactText => {
        return toast.warning(
            <ToastFreeConsultationMessage buffer={buffer} accept={accept} deny={deny} />,
            Object.assign({}, ToastService.freeConsultationOpts)
        );
    };

    creditCard = (message: string): void => {
        const customToast: JSX.Element = (
            <div className="Toastify--custom">
                <div className="Toastify--custom__message">{message}</div>
                <div className="Toastify--custom__icon">
                    <Link to={PROFILE_PATHS.MY_PROFILE_ACCOUNT} className="btn btn--sm btn--secondary">
                        Add
                    </Link>
                </div>
            </div>
        );
        toast.warning(customToast, Object.assign({}, ToastService.notificationOpts));
    };
}

const toastService = new ToastService();

export default toastService;
