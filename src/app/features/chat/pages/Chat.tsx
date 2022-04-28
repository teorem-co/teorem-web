import { curryGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import IChatEnginePost from '../../../../interfaces/IChatEnginePost';
import MainWrapper from '../../../components/MainWrapper';
import { useAppSelector } from '../../../hooks';
import { useAddUserMutation } from '../../../services/chatEngineService';
import AsideWrapper from '../components/AsideWrapper';
import SendMessageForm from '../components/SendMessageForm';
import SingleConversation from '../components/SingleConversation';
import { IChatRoom, ISendChatMessage, readMessage, setActiveChatRoom } from '../slices/chatSlice';


const Chat = () => {

    const user = useAppSelector((state) => state.auth.user);
    const chat = useAppSelector((state) => state.chat);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!chat.activeChatRoom) {

            for (let i = 0; i < chat.chatRooms.length; i++) {

                if (i == 0) {
                    dispatch(setActiveChatRoom(chat.chatRooms[0]));
                    break;
                }
            }
        }
    }, []);

    return (
        <MainWrapper>
            {/* <div>
                <button onClick={() => addUser()}>add user</button>
            </div> */}
            <div className="card--chat card--primary--shadow">



                {/*<ChatEngine height="100%" userName={chatUserName} userSecret="Teorem1!" projectID="18898bd1-08c8-40ea-aed1-fb1a1cf1e413" />*/}

                {/* <div className="card--chat__aside">
                    <div className="p-4">
                        <div className="type--wgt--bold type--lg">Chat</div>
                        <input type="text" placeholder="Search in chat" className="input p-3 mt-6" />
                    </div>
                    <div className="chat__messages-wrapper">
                        {chatConversationList.map((chatConversationItem: IChatConversationItem, index: number) => {
                            return <ConversationAside key={index} data={chatConversationItem} />;
                        })}
                    </div>
                    </div>*/}
                <AsideWrapper data={chat.chatRooms} />

                <SingleConversation data={chat.activeChatRoom} />
                {/*<div className="content">
                    <div className="content__header content__header--chat">
                        <div className="flex flex--center">
                            <img className="chat__conversation__avatar" src="https://source.unsplash.com/random/?girl" alt="chat avatar" />

                            <div className="ml-3 type--wgt--bold">John doe</div>
                        </div>
                        <button className="btn btn--primary btn--base">Book a session</button>
                    </div>
                    
                    <div className="content__main">
                        {chatConversation.map((chatConversation: IChatConversation, index: number) => {
                            return chatConversation.incomingMessage ? (
                                <OtherUserMessage key={index} data={chatConversation} />
                            ) : (
                                <LoggedUserMessage key={index} data={chatConversation} />
                            );
                        })}
                    </div>
                    <div className="content__footer content__footer--chat">
                        <div className="flex--shrink">
                            <i className="icon icon--base icon--attachment icon--black"></i>
                        </div>
                        <input type="text" className="input ml-5 p-2" />
                    </div>
                </div> */}
            </div>
        </MainWrapper>
    );
};

export default Chat;
