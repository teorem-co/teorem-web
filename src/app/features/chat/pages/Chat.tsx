import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MainWrapper from '../../../components/MainWrapper';
import { useAppSelector } from '../../../hooks';
import AsideWrapper from '../components/AsideWrapper';
import SingleConversation from '../components/SingleConversation';
import { setActiveChatRoomById } from '../slices/chatSlice';


const Chat = () => {

    const chat = useAppSelector((state) => state.chat);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!chat.activeChatRoom) {

            for (let i = 0; i < chat.chatRooms.length; i++) {

                if (i == 0) {
                    dispatch(setActiveChatRoomById({ userId: chat.chatRooms[0].user?.userId + '', tutorId: chat.chatRooms[0].tutor?.userId + '' }));
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
