import { t } from 'i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLazyGetUserQuery } from '../../services/userService';
import {
    addChatRoom,
    addMessage,
    setActiveChatRoom,
    setConsultationInitialized,
    setFreeConsultation,
    setLink,
} from '../features/chat/slices/chatSlice';
import { useAppSelector } from '../hooks';
import { PATHS } from '../routes';

interface Props {
    buffer: any;
    accept: () => void;
    deny: () => void;
}

const ToastFreeConsultationMessage = (props: Props) => {
    const chat = useAppSelector((state) => state.chat);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const userData = useAppSelector((state) => state.user);

    const dispatch = useDispatch();

    const [getUserById, { data: user2Data }] = useLazyGetUserQuery();

    const onAcceptConsultation = async () => {
        chat.socket.emit('acceptedFreeConsultation', props.buffer);
        dispatch(setConsultationInitialized(true));
        dispatch(setFreeConsultation(true));
        dispatch(setLink(props.buffer.link + userId));
        props.accept();

        if (chat.chatRooms && chat.chatRooms.length) {
            for (let i = 0; i < chat.chatRooms.length; i++) {
                if (chat.chatRooms[i].user?.userId == props.buffer.userId && chat.chatRooms[i].tutor?.userId == props.buffer.tutorId) {
                    dispatch(setActiveChatRoom(chat.chatRooms[i]));

                    if (props.buffer.missedCall) {
                        const message: any = {
                            userId: props.buffer.userId,
                            tutorId: props.buffer.tutorId,
                            message: {
                                messageId: '',
                                messageNew: true,
                                message: '<i>Propušten poziv</i>',
                                createdAt: new Date(),
                                isRead: false,
                                isFile: false,
                            },
                            senderId: props.buffer.senderId,
                        };

                        dispatch(addMessage(message));

                        chat.socket.emit('messageSent', message);

                        dispatch(addMessage(message));
                    }

                    return;
                }
            }

            if (props.buffer.missedCall) {
                let user: any = null;
                let user2: any = null;

                if (userData.user?.id == props.buffer.userId) {
                    user = userData.user;
                    user2 = await getUserById(props.buffer.tutorId).unwrap();
                } else {
                    user = await getUserById(props.buffer.userId).unwrap();
                    user2 = userData.user;
                }

                dispatch(
                    addChatRoom({
                        user: {
                            userId: user.id + '',
                            userImage: 'teorem.co:3000/profile/images/profilePictureDefault.jpg', //TODO: link not important
                            userNickname: user?.firstName + ' ' + user?.lastName,
                        },
                        tutor: {
                            userId: user2.id + '',
                            userImage: user2.profileImage,
                            userNickname: user2.firstName + ' ' + user2.lastName,
                        },
                        messages: [],
                        unreadMessageCount: 0,
                    })
                );
            }
        }
    };

    const onDenyConsultation = () => {
        chat.socket.emit('deniedFreeConsultation', props.buffer);
        dispatch(setFreeConsultation(false));
        dispatch(setLink(null));
        dispatch(setConsultationInitialized(false));
        props.deny();
    };

    return (
        <div className="Toastify--custom Toastify--custom--free-consultation">
            <div className="Toastify--custom__title type--wgt--bold">{t('CHAT.CHAT_REQUEST_TITLE')}</div>
            <div className="Toastify--custom__icon">
                <i className="icon icon--base icon--calendar icon--white"></i>
            </div>
            <div className="Toastify--custom__message">
                <Link className={`btn btn--secondary btn--base Toastify--button`} onClick={onAcceptConsultation} to={PATHS.CHAT}>
                    {t('CHAT.ACCEPT_CONSULTATION')}
                </Link>
                <button className={`btn btn--error--primary btn--base Toastify--button Toastify--button--deny`} onClick={onDenyConsultation}>
                    {t('CHAT.DENY_CONSULTATION')}
                </button>
            </div>
        </div>
    );
};

export default ToastFreeConsultationMessage;
