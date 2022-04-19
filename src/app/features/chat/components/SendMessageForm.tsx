import { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks";
import { addMessage, IChatRoom, ISendChatMessage } from "../slices/chatSlice";

interface Props {
    data: IChatRoom | null;
}

const SendMessageForm = (props: Props) => {

    const newMessageRef = useRef<HTMLInputElement>(null);
    const chat = useAppSelector((state) => state.chat);

    const dispatch = useDispatch();

    const onSubmit = (event: any) => {

        event.preventDefault();

        if (props.data) {

            const text: string = newMessageRef.current?.value + '';

            if (text.length > 0) {
                const message: ISendChatMessage = {
                    tutorId: props.data.tutor?.userId + '',
                    userId: props.data.user?.userId + '',
                    message: {
                        messageNew: true,
                        message: text,
                        createdAt: new Date(),
                        isRead: false,
                        messageId: ''
                    },
                    senderId: chat.user?.userId
                };

                chat.socket.emit('messageSent', message);

                dispatch(addMessage(message));

                if (newMessageRef.current)
                    newMessageRef.current.value = '';
            }
        }
    };
    return (
        <form method="POST" action="" onSubmit={onSubmit}>
            <div className="flex--shrink">
                <i className="icon icon--base icon--attachment icon--black"></i>
            </div>
            <input ref={newMessageRef} type="text" className="input ml-5 p-2" />
        </form>
    );
};

export default SendMessageForm;