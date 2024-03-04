import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import MainWrapper from '../../../components/MainWrapper';
import { useAppSelector } from '../../../hooks';
import AsideWrapper from '../components/AsideWrapper';
import SingleConversation from '../components/SingleConversation';
import { ContextProvider } from '../contexts/Context';
import { IChatRoom } from '../slices/chatSlice';
import MediaQuery from 'react-responsive';

const Chat = () => {
    const chat = useAppSelector((state) => state.chat);

    const dispatch = useDispatch();

    const [tempChatRooms, setTempChatRooms] = useState<IChatRoom[]>([]);

    useEffect(() => {
        if (!chat.activeChatRoom) {
            /*for (let i = 0; i < chat.chatRooms.length; i++) {

          if (i == 0) {
              dispatch(setActiveChatRoomById({ userId: chat.chatRooms[0].user?.userId + '', tutorId: chat.chatRooms[0].tutor?.userId + '' }));
              break;
          }
      }*/
        }
    }, []);

    useEffect(() => {
        if (chat.chatRooms) {
            const chats = [...chat.chatRooms];
            chats.sort((a: IChatRoom, b: IChatRoom) => {
                if (a.messages.length == 0 || b.messages.length == 0) return -1;

                const lastMessageA: Date = new Date(a.messages[a.messages.length - 1].message.createdAt);
                const lastMessageB: Date = new Date(b.messages[b.messages.length - 1].message.createdAt);

                return lastMessageA > lastMessageB ? -1 : 1;
            });
            setTempChatRooms(chats);
        }
    }, [chat.chatRooms]);

    // const isMobile
    return (
        <ContextProvider>
            <MainWrapper>
                <div className="card--chat card--primary--shadow">
                    <MediaQuery minWidth={766}>
                        <AsideWrapper data={tempChatRooms} />
                        <SingleConversation data={chat.activeChatRoom} />
                    </MediaQuery>

                    <MediaQuery maxWidth={765}>
                        {chat.activeChatRoom ? <SingleConversation data={chat.activeChatRoom} /> : <AsideWrapper data={tempChatRooms} />}
                    </MediaQuery>

                    {/*{isMobile ?*/}
                    {/*  <MediaQuery maxWidth={765}>*/}
                    {/*    <SingleConversation data={chat.activeChatRoom}/>*/}
                    {/*    <AsideWrapper data={tempChatRooms} />*/}
                    {/*  </MediaQuery>*/}

                    {/*  :*/}

                    {/*  chat.activeChatRoom ?*/}
                    {/*    <SingleConversation data={chat.activeChatRoom}/>*/}
                    {/*    :*/}
                    {/*    <AsideWrapper data={tempChatRooms} />*/}
                    {/*}*/}
                </div>
            </MainWrapper>
        </ContextProvider>
    );
};

export default Chat;
