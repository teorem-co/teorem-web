import { t } from "i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveChatRoom, setFreeConsultation, setLink } from "../features/chat/slices/chatSlice";
import { useAppSelector } from "../hooks";
import { PATHS } from "../routes";

interface Props {

    buffer: any;
}

const ToastFreeConsultationMessage = (props: Props) => {

    const chat = useAppSelector((state) => state.chat);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const dispatch = useDispatch();

    const onAcceptConsultation = () => {

        if (chat.chatRooms && chat.chatRooms.length) {

            chat.socket.emit("acceptedFreeConsultation", props.buffer);

            for (let i = 0; i < chat.chatRooms.length; i++) {

                if (chat.chatRooms[i].user?.userId == props.buffer.userId && chat.chatRooms[i].tutor?.userId == props.buffer.tutorId) {

                    dispatch(setActiveChatRoom(chat.chatRooms[i]));
                    dispatch(setFreeConsultation(true));
                    dispatch(setLink(props.buffer.link + userId));
                    break;
                }
            }

        }
    };

    const onDenyConsultation = () => {

        chat.socket.emit("deniedFreeConsultation", props.buffer);
        dispatch(setFreeConsultation(false));
        dispatch(setLink(null));
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
                    to={`${PATHS.CHAT}`}>
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

export default ToastFreeConsultationMessage;