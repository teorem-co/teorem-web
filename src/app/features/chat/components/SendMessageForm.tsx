import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../../../hooks";
import { usePostUploadFileMutation } from "../services/chatService";
import { addMessage, IChatRoom, ISendChatMessage } from "../slices/chatSlice";
import { saveAs } from 'file-saver';

interface Props {
    data: IChatRoom | null;
    scrollOnSend: () => void;
}

const SendMessageForm = (props: Props) => {

    const newMessageRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const chat = useAppSelector((state) => state.chat);

    const [fileToSend, setFileToSend] = useState<File>();

    const [postFile, { data: postFileData, isSuccess: isSuccessPostFile }] = usePostUploadFileMutation();

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
                        messageId: '',
                        messageMissedCall:false,
                        isFile: false,
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
                fd.append("uploadFile", fileToSend);
                fd.append("userId", chat.activeChatRoom?.user?.userId || '');
                fd.append("tutorId", chat.activeChatRoom?.tutor?.userId || '');
                fd.append("senderId", chat.user?.userId || '');
                fd.append("fileName", fileName || '');
                fd.append("fileExt", '.' + fileExt || '');

                const data = {
                    "uploadFile": fileToSend,
                    "userId": chat.activeChatRoom?.user?.userId || "",
                    "tutorId": chat.activeChatRoom?.tutor?.userId || "",
                    "senderId": chat.user?.userId || "",
                    "fileName": fileName || "",
                    "fileExt": "." + fileExt || ""
                };

                console.log("sending message via socket", data);
                //chat.socket.emit("fileSent", data);
                postFile(fd);
            }
        }
    };

    useEffect(() => {

        if (isSuccessPostFile) {

            console.log("SUCCESSFUL JE BILO");
            if (fileRef.current?.form) {
                fileRef.current.form.reset();
                setFileToSend(undefined);
            }

            if (postFileData) {
                console.log(postFileData);
                dispatch(addMessage({
                    userId: postFileData.userId,
                    tutorId: postFileData.tutorId,
                    message: {
                        message: postFileData.message.message,
                        messageId: postFileData.message.messageId,
                        isRead: postFileData.message.isRead,
                        isFile: postFileData.message.isFile,
                        createdAt: postFileData.message.createdAt,
                        messageNew: true,
                    },
                    senderId: postFileData.senderId
                }));
                props.scrollOnSend();
            }
        }

    }, [isSuccessPostFile]);

    function downloadFile2() {
        fetch(`http://localhost:8080/api/v1/chat/chat-file/3b4ca35d-c972-41c7-9a36-e27f95181f59`)
            .then(response => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const fileName = contentDisposition?.split('=')[1];

                response.blob().then(blob => {
                    saveAs(blob, fileName);
                });
            });
    };

    return (
        <>
            {fileToSend && <div className="chat-file-message-send"><button className="close-button-popup" onClick={onCancelFileSend}><i className="icon--close"></i></button><p>{fileToSend.name}</p><button onClick={onFileSend}><i className="icon--upload"></i></button></div>}
            <div className="content__footer content__footer--chat">

                <form className="chat-file-send-form" method="POST" action="" onSubmit={onSubmit}>
                    <div className="flex--shrink input-file-relative">
                        <div role='button'>

                            <label role='button' htmlFor="file-input">
                                <i className="icon icon--base icon--attachment icon--black"></i>
                            </label>
                            <input ref={fileRef} type="file" name="uploadFile" className="input-file-hidden" onInput={onFileUpload} />

                        </div>
                    </div>


                    {/*<div role='button' onClick={downloadFile2}>*/}
                    {/*    PREUZMI*/}
                    {/*</div>*/}
                    <input ref={newMessageRef} type="textArea" className="input ml-5 p-2" />
                </form>
            </div>
        </>
    );
};

export default SendMessageForm;