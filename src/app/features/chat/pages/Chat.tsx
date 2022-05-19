import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MainWrapper from '../../../components/MainWrapper';
import { useAppSelector } from '../../../hooks';
import AsideWrapper from '../components/AsideWrapper';
import SingleConversation from '../components/SingleConversation';
import { setActiveChatRoom } from '../slices/chatSlice';


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
            <div className="card--chat card--primary--shadow">
                <AsideWrapper data={chat.chatRooms} />
                <SingleConversation data={chat.activeChatRoom} />
            </div>
        </MainWrapper>
    );
};

export default Chat;
