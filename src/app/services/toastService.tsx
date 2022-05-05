import i18next, { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
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
        closeOnClick: true,
        pauseOnHover: false,
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

    freeConsultation = (buffer: any): React.ReactText => {

        const CustomToast = () => {

            const chat = useAppSelector((state) => state.chat);
            const userId = useAppSelector((state) => state.auth.user?.id);
            const dispatch = useDispatch();

            const onAcceptConsultation = () => {

                if (chat.chatRooms && chat.chatRooms.length) {

                    chat.socket.emit("acceptedFreeConsultation", buffer);

                    for (let i = 0; i < chat.chatRooms.length; i++) {

                        if (chat.chatRooms[i].user?.userId == buffer.userId && chat.chatRooms[i].tutor?.userId == buffer.tutorId) {

                            dispatch(setActiveChatRoom(chat.chatRooms[i]));
                            dispatch(setFreeConsultation(true));
                            dispatch(setLink(buffer.link + userId));
                            break;
                        }
                    }
                }
            };

            const onDenyConsultation = () => {
                return;
            };

            return (
                <div className="Toastify--custom Toastify--custom--free-consultation">
                    <div className="Toastify--custom__title type--wgt--bold">
                        {t("CHAT.CHAT_REQUEST_TITLE")}
                    </div>
                    <div className="Toastify--custom__icon">
                        <i className="icon icon--base icon--calendar icon--white"></i>
                    </div>
                    <div className="Toastify--custom__message">
                        <Link
                            className={`btn btn--secondary btn--base Toastify--button`}
                            onClick={onAcceptConsultation}
                            to={PATHS.CHAT}>
                            {t("CHAT.ACCEPT_CONSULTATION")}
                        </Link>
                        <button
                            className={`btn btn--error btn--base Toastify--button Toastify--button--deny`}
                            onClick={onDenyConsultation}
                        >
                            {t("CHAT.DENY_CONSULTATION")}
                        </button>
                    </div>
                </div>
            );
        };

        return toast.warning(<CustomToast />, Object.assign({}, ToastService.freeConsultationOpts));
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
