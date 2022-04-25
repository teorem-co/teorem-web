import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../../../hooks";
import { usePostUploadFileMutation } from "../services/chatService";
import { addMessage, IChatRoom, ISendChatMessage } from "../slices/chatSlice";

interface Props {
    data: IChatRoom | null;
    scrollOnSend: () => void;
}

const SendMessageForm = (props: Props) => {

    const newMessageRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const chat = useAppSelector((state) => state.chat);

    const [fileToSend, setFileToSend] = useState<File>();

    const [postFile] = usePostUploadFileMutation();

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

                props.scrollOnSend();

                if (newMessageRef.current)
                    newMessageRef.current.value = '';
            }
        }
    };

    const onFileUpload = (event: any) => {

        if (fileRef.current?.files && fileRef.current?.files.length > 0)
            setFileToSend(fileRef.current?.files[0]);
    };

    const onCancelFileSend = async (event: any) => {

        if (fileToSend && fileRef.current?.form) {
            fileRef.current.form.reset();
            setFileToSend(undefined);
        }
    };

    const onFileSend = async (event: any) => {


        if (fileToSend) {

            const fileSplit = fileToSend.name.split(".");
            const fileExt = fileSplit.pop();
            const fileName = fileSplit.join(".");

            if (fileRef.current?.form) {
                const fd = new FormData(fileRef.current?.form);
                //fd.append("uploadFile", fileToSend);
                fd.append("userId", chat.activeChatRoom?.user?.userId || '');
                fd.append("tutorId", chat.activeChatRoom?.tutor?.userId || '');
                fd.append("senderId", chat.user?.userId || '');
                fd.append("isFile", "true");
                fd.append("fileName", fileName || '');
                fd.append("fileExt", '.' + fileExt || '');

                const message = await postFile(fd).unwrap();

                fileRef.current.form.reset();
                setFileToSend(undefined);

                if (message) {

                    dispatch(addMessage({
                        userId: message.userId,
                        tutorId: message.tutorId,
                        message: {
                            message: message.message.message,
                            messageId: message.message.messageId,
                            isRead: message.message.isRead,
                            isFile: message.message.isFile,
                            createdAt: message.message.createdAt,
                            messageNew: true,
                        },
                        senderId: message.senderId
                    }));

                    props.scrollOnSend();
                }
            }
        }
    };
    return (
        <>
            {fileToSend && <div className="chat-file-message-send"><button onClick={onCancelFileSend}><i className="icon--close"></i></button><p>{fileToSend.name}</p><button onClick={onFileSend}><i className="icon--upload"></i></button></div>}
            <div className="content__footer content__footer--chat">
                <form className="chat-file-send-form" method="POST" action="" onSubmit={onSubmit}>
                    <div className="flex--shrink input-file-relative">
                        <input ref={fileRef} type="file" name="uploadFile" className="input-file-hidden" onInput={onFileUpload} />
                        <i className="icon icon--base icon--attachment icon--black"></i>
                    </div>
                    <input ref={newMessageRef} type="text" className="input ml-5 p-2" />
                </form>
            </div>
        </>
    );
};

export default SendMessageForm;