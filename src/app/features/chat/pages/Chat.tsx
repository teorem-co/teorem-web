import { useEffect, useState } from 'react';
import { ChatEngine } from 'react-chat-engine';

import IChatEnginePost from '../../../../interfaces/IChatEnginePost';
import IUser from '../../../../interfaces/IUser';
import MainWrapper from '../../../components/MainWrapper';
import { chatConversation, chatConversationList, IChatConversation, IChatConversationItem } from '../../../constants/chatConstants';
import { useAppSelector } from '../../../hooks';
import { useAddUserMutation } from '../../../services/chatEngineService';
import ConversationAside from '../components/ConversationAside';
import LoggedUserMessage from '../components/LoggedUserMessage';
import OtherUserMessage from '../components/OtherUserMessage';

const Chat = () => {
    const user = useAppSelector((state) => state.auth.user);

    const chatUserName = user?.email.split('@')[0];

    const [addUserQuery] = useAddUserMutation();

    const addUser = async () => {
        const toSend: IChatEnginePost = {
            email: 'neven.jovic2@gmail.com',
            first_name: 'Neven',
            last_name: 'Jovic',
            secret: 'Teorem1!',
            username: 'neven.jovic2',
        };

        await addUserQuery(toSend).unwrap();
    };

    return (
        <MainWrapper>
            {/* <div>
                <button onClick={() => addUser()}>add user</button>
            </div> */}
            <div className="card--chat card--primary--shadow">
                <ChatEngine height="100%" userName={chatUserName} userSecret="Teorem1!" projectID="18898bd1-08c8-40ea-aed1-fb1a1cf1e413" />
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
                </div>
                
                <div className="content">
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
