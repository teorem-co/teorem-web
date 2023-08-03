import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../../hooks';
import {
  useLazyGetChatRoomsQuery,
  useLazyGetOnSearchChatRoomsQuery,
} from '../services/chatService';
import { addChatRooms, IChatRoom } from '../slices/chatSlice';
import ConversationAside from './ConversationAside';

interface Props {
  data: IChatRoom[];
}

const AsideWrapper = (props: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const activeChat = useAppSelector((state) => state.chat.activeChatRoom);
  const chat = useAppSelector((state) => state.chat);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState<number>(1);
  const [tempSearchChatData, setTempSearchChatData] = useState<IChatRoom[]>([]);

  const [getSearchChat, {
    data: searchChatData,
    isSuccess: searchDataIsSuccess,
  }] = useLazyGetOnSearchChatRoomsQuery();
  const [getChatRooms, {
    data: chatRooms,
    isSuccess: isSuccessChatRooms,
  }] = useLazyGetChatRoomsQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccessChatRooms) {
      dispatch(addChatRooms(chatRooms || null));
    }
  }, [isSuccessChatRooms]);

  useEffect(() => {
    if (searchChatData) {
      const temDat = [...searchChatData];
      temDat.sort((a: IChatRoom, b: IChatRoom) => {
        const lastMessageA: Date = new Date(a.messages[a.messages.length - 1].message.createdAt);
        const lastMessageB: Date = new Date(b.messages[b.messages.length - 1].message.createdAt);

        return lastMessageA > lastMessageB ? -1 : 1;
      });

      setTempSearchChatData(temDat);
    }
  }, [searchChatData]);

  const onSearch = () => {
    if (searchInputRef.current?.value && searchInputRef.current?.value.length > 0) {
      getSearchChat({
        limitMessages: 20,
        search: searchInputRef.current?.value,
        page: page,
        rpp: 20,
      });
    } else {
      getChatRooms({
        page: 1,
        rpp: chat.rpp,
        limitMessages: chat.rpp,
      });
    }
  };

  const cacheBuster = new Date();

    return (
        <div className='card--chat__aside'>
      <div className='p-4'>
        <div className='type--wgt--bold type--lg'>Chat</div>
        <input ref={searchInputRef} type='text' onKeyUp={onSearch}
               placeholder={t('CHAT.SEARCH_PLACEHOLDER')}
               className='input p-3 mt-6' />
      </div>
      <div className='chat__messages-wrapper'>
        {!searchDataIsSuccess || !(searchInputRef.current?.value && searchInputRef.current?.value.length > 0)
          ? props.data.map((chatConversationItem: IChatRoom, index: number) => {
            if (
              chatConversationItem.messages[chatConversationItem.messages.length - 1] &&
              chatConversationItem.messages[chatConversationItem.messages.length - 1].message
            ) {
              let messageText = chatConversationItem.messages[chatConversationItem.messages.length - 1].message.message || '';
              messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function(match: any, token: any) {
                return t(token);
              });
              messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function(match: any, token: any) {
                return chat.buffer?.senderId == chatConversationItem.tutor?.userId
                  ? `${chatConversationItem.user?.userNickname}`
                  : `${chatConversationItem.tutor?.userNickname}`;
              });
              const lastMessageTime = chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt;

              console.log("NEPROCITANE PORUKE: ", chatConversationItem.unreadMessageCount);

                              const chatConversation = {
                                  imgUrl:
                                      (user?.id != chatConversationItem.user?.userId
                                          ? false
                                          :  `${chatConversationItem.tutor?.userImage}&v=${cacheBuster}`),
                                  name:
                                      (user?.id != chatConversationItem.user?.userId
                                          ? chatConversationItem.user?.userNickname
                                          : chatConversationItem.tutor?.userNickname) + '',
                                  lastMessage: messageText,
                                  lastMessageTime: moment(lastMessageTime).isSame(moment(), 'day') ?
                  moment(lastMessageTime).format('HH:mm')
                  :
                                      moment(lastMessageTime).format('DD MMM YYYY')
                                      .replace('.', ''),
                                  unread: chatConversationItem.unreadMessageCount > 0,
                              numberOfUnread: chatConversationItem.unreadMessageCount
              };

              return chatConversationItem.tutor?.userId == activeChat?.tutor?.userId &&
              chatConversationItem.user?.userId == activeChat?.user?.userId ? (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={true} />
              ) : (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={false} />
              );
            } else {
              const chatConversation = {
                imgUrl:
                  (user?.id != chatConversationItem.user?.userId
                    ? false
                    : chatConversationItem.tutor?.userImage),
                name:
                  (user?.id != chatConversationItem.user?.userId
                    ? chatConversationItem.user?.userNickname
                    : chatConversationItem.tutor?.userNickname) + '',
                lastMessage: '<i>Send a message to start a conversation</i>',
                lastMessageTime: '',
                unread: chatConversationItem.unreadMessageCount > 0,
              };

              return chatConversationItem.tutor?.userId == activeChat?.tutor?.userId &&
              chatConversationItem.user?.userId == activeChat?.user?.userId ? (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={true} />
              ) : (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={false} />
              );
            }
            searchChatData;
          })
          : searchChatData &&
          tempSearchChatData.map((chatConversationItem: IChatRoom, index: number) => {
            if (
              chatConversationItem.messages[chatConversationItem.messages.length - 1] &&
              chatConversationItem.messages[chatConversationItem.messages.length - 1].message
            ) {
              let messageText = chatConversationItem.messages[chatConversationItem.messages.length - 1].message.message;
              messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function(match: any, token: any) {
                return t(token);
              });
              messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function(match: any, token: any) {
                return chat.buffer?.senderId == chatConversationItem.tutor?.userId
                  ? `${chatConversationItem.user?.userNickname}`
                  : `${chatConversationItem.tutor?.userNickname}`;
              });

              const chatConversation = {
                imgUrl:
                  (user?.id != chatConversationItem.user?.userId
                    ? false
                    : chatConversationItem.tutor?.userImage),
                name:
                  (user?.id != chatConversationItem.user?.userId
                    ? chatConversationItem.user?.userNickname
                    : chatConversationItem.tutor?.userNickname) + '',
                lastMessage: messageText,
                lastMessageTime: moment(
                  chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt,
                ).format('DD.MMM.YYYY'),
                unread: chatConversationItem.unreadMessageCount > 0,
              };

              return chatConversationItem.tutor?.userId == activeChat?.tutor?.userId &&
              chatConversationItem.user?.userId == activeChat?.user?.userId ? (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={true} />
              ) : (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={false} />
              );
            } else {
              const chatConversation = {
                imgUrl:
                  (user?.id != chatConversationItem.user?.userId
                    ? false
                    : chatConversationItem.tutor?.userImage),
                name:
                  (user?.id != chatConversationItem.user?.userId
                    ? chatConversationItem.user?.userNickname
                    : chatConversationItem.tutor?.userNickname) + '',
                lastMessage: '<i>Send a message to start a conversation</i>',
                lastMessageTime: '',
                unread: chatConversationItem.unreadMessageCount > 0,
              };

              return chatConversationItem.tutor?.userId == activeChat?.tutor?.userId &&
              chatConversationItem.user?.userId == activeChat?.user?.userId ? (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={true} />
              ) : (
                <ConversationAside key={index} chat={chatConversationItem}
                                   data={chatConversation} active={false} />
              );
            }
          })}
      </div>
    </div>
  );
};

export default AsideWrapper;
