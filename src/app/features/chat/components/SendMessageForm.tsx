import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../store/hooks';
import { usePostUploadFileMutation } from '../services/chatService';
import { addMessage, IChatRoom, ISendChatMessage } from '../slices/chatSlice';
import { ImAttachment } from 'react-icons/im';
import { IoSendSharp } from 'react-icons/io5';

interface Props {
  data: IChatRoom | null;
  scrollOnSend: () => void;
}

const SendMessageForm = (props: Props) => {
  const newMessageRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const chat = useAppSelector((state) => state.chat);
  const userId = useAppSelector((state) => state.auth.user?.id);

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
            message: text.trim(),
            createdAt: date.toISOString(),
            isRead: false,
            messageId: '',
            messageMissedCall: false,
            isFile: false,
          },
          senderId: userId,
        };

        chat.socket.emit('messageSent', message);
        dispatch(addMessage(message));

        props.scrollOnSend();

        if (newMessageRef.current) {
          newMessageRef.current.value = '';
          adjustTextareaHeight();
        }
      }
    }
  };

  const onFileUpload = (event: any) => {
    if (fileRef.current?.files && fileRef.current?.files.length > 0) setFileToSend(fileRef.current?.files[0]);
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
          uploadFile: fileToSend,
          userId: chat.activeChatRoom?.user?.userId || '',
          tutorId: chat.activeChatRoom?.tutor?.userId || '',
          senderId: chat.user?.userId || '',
          fileName: fileName || '',
          fileExt: '.' + fileExt || '',
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
        dispatch(
          addMessage({
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
          }),
        );
        props.scrollOnSend();
      }
    }
  }, [isSuccessPostFile]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  const adjustTextareaHeight = () => {
    if (newMessageRef.current) {
      newMessageRef.current.style.height = 'auto';
      const scrollHeight = newMessageRef.current.scrollHeight;
      newMessageRef.current.style.height = `${scrollHeight}px`;
    }
  };

  const handleInput = () => {
    adjustTextareaHeight();
  };

  return (
    <>
      <div className='content__footer content__footer--chat'>
        <form className='chat-file-send-form' method='POST' action=''
              onSubmit={onSubmit}>
          <label htmlFor='uploadFile' className='file-upload-label'>
            <ImAttachment className='border-hover' size='25' />

            <input
              ref={fileRef}
              type='file'
              id='uploadFile'
              name='uploadFile'
              onChange={onFileUpload}
              style={{
                display: 'none',
              }}
            />
          </label>

          <textarea
            ref={newMessageRef}
            className='input ml-5 p-2 mr-5 mt-2'
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            style={{
              resize: 'none',
              height: 'auto', // Initial height for 2 rows
              maxHeight: '300px',
              overflow: 'hidden',
            }}
          />
          <IoSendSharp className={'cur--pointer scale-hover--scale-105'}
                       size='25' onClick={onSubmit} />
        </form>
      </div>
    </>
  );
};

export default SendMessageForm;
