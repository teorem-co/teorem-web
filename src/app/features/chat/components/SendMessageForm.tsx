import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../../hooks';
import { usePostUploadFileMutation } from '../services/chatService';
import { addMessage, IChatRoom, ISendChatMessage } from '../slices/chatSlice';
import { ImAttachment } from 'react-icons/im';
import { TextareaAutosize } from '@mui/material';
import { VscSend } from 'react-icons/vsc';

interface Props {
  data: IChatRoom | null;
  scrollOnSend: () => void;
}

const SendMessageForm = (props: Props) => {

  const newMessageRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const chat = useAppSelector((state) => state.chat);

  const [fileToSend, setFileToSend] = useState<File>();

  const [postFile, {
    data: postFileData,
    isSuccess: isSuccessPostFile,
  }] = usePostUploadFileMutation();

  const dispatch = useDispatch();

  const onSubmit = (event: any) => {

    event.preventDefault();

    if (props.data) {

      const text: string = newMessageRef.current?.value + '';
      if (text.trim().length > 0) {
        const date = new Date();

        const message: ISendChatMessage = {
          tutorId: props.data.tutor?.userId + '',
          userId: props.data.user?.userId + '',
          message: {
            messageNew: true,
            message: text,
            createdAt: date.toISOString(),
            isRead: false,
            messageId: '',
            messageMissedCall: false,
            isFile: false,
          },
          senderId: chat.user?.userId,
        };

        chat.socket.emit('messageSent', message);
        dispatch(addMessage(message));

        props.scrollOnSend();

        resetHeights();
      }
    }
  };

  function resetHeights() {
    if (newMessageRef.current && containerRef.current) {
      newMessageRef.current.value = '';
      newMessageRef.current.style.height = '40px';
      containerRef.current.style.height = 'auto';
    }
  }

  const onFileUpload = (event: any) => {

    if (fileRef.current?.files && fileRef.current?.files.length > 0)
      setFileToSend(fileRef.current?.files[0]);
  };

  useEffect(() => {
    if (fileToSend) {
      onFileSend();
    }
  }, [fileToSend]);


  const onFileSend = async () => {


    if (fileToSend) {

      const fileSplit = fileToSend.name.split('.');
      const fileExt = fileSplit.pop();
      const fileName = fileSplit.join('.');

      if (fileRef.current?.form) {

        const fd = new FormData(fileRef.current?.form);
        fd.append('uploadFile', fileToSend);
        fd.append('userId', chat.activeChatRoom?.user?.userId || '');
        fd.append('tutorId', chat.activeChatRoom?.tutor?.userId || '');
        fd.append('senderId', chat.user?.userId || '');
        fd.append('fileName', fileName || '');
        fd.append('fileExt', '.' + fileExt || '');

        const data = {
          'uploadFile': fileToSend,
          'userId': chat.activeChatRoom?.user?.userId || '',
          'tutorId': chat.activeChatRoom?.tutor?.userId || '',
          'senderId': chat.user?.userId || '',
          'fileName': fileName || '',
          'fileExt': '.' + fileExt || '',
        };

        postFile(fd);
      }
    }
  };

  useEffect(() => {

    if (isSuccessPostFile) {

      if (fileRef.current?.form) {
        fileRef.current.form.reset();
        setFileToSend(undefined);
      }

      if (postFileData) {
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
          senderId: postFileData.senderId,
        }));
        props.scrollOnSend();
      }
    }

  }, [isSuccessPostFile]);


  const adjustHeight = (element: HTMLDivElement) => {

    //element.style.height = element.scrollHeight + 'px';
    if(containerRef.current){
      containerRef.current.style.height = 'auto';
      containerRef.current.style.height = element.scrollHeight + 'px';
    }
  };

  const handleTextChange = () => {
    const containerCurrent = containerRef.current;
    if (containerCurrent) {
      adjustHeight(containerCurrent);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      submitForm();
    }
  };

  const submitForm = () => {
    // If you want to call the onSubmit handler directly
    // onSubmit();

    // Or if you want to trigger a submit event on the form
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <>
      {/*{fileToSend && <div className="chat-file-message-send"><button className="close-button-popup" onClick={onCancelFileSend}><i className="icon--close"></i></button><p>{fileToSend.name}</p><button onClick={onFileSend}><i className="icon--upload"></i></button></div>}*/}
      <div ref={containerRef} className='content__footer content__footer--chat'>

        <form ref={formRef} className='chat-file-send-form' method='POST'
              action=''
              onSubmit={onSubmit}>

          <label htmlFor='uploadFile' className='file-upload-label'>

            <ImAttachment className='border-hover' size='25' />

            <input
              ref={fileRef}
              type='file'
              id='uploadFile'
              name='uploadFile'
              onChange={onFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          <TextareaAutosize
            maxRows={4}
            ref={newMessageRef}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className='input ml-5 p-1 chat-text-area'
          />

          <VscSend
            onClick={submitForm}
            className="ml-1 cur--pointer scale-hover--scale-110"
            size='30'/>
        </form>
      </div>
    </>
  );
};

export default SendMessageForm;
