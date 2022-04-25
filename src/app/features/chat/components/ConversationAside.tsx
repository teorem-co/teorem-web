import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { IChatConversationItem } from '../../../constants/chatConstants';
import { IChatRoom, setActiveChatRoom } from '../slices/chatSlice';

interface Props {
    data: IChatConversationItem;
    chat: IChatRoom;
    active?: boolean;
}

const ConversationAside = (props: Props) => {
    const { imgUrl, name, lastMessage, lastMessageTime, unread } = props.data;

    const messageRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const selectChat = () => {
        dispatch(setActiveChatRoom(props.chat));
    };

    useEffect(() => {

        if (messageRef.current) {

            let message: string;
            const child = messageRef.current.firstElementChild;

            if (child) {
                message = child.innerHTML;
            } else {
                message = messageRef.current.innerHTML;
            }

            if (message.length > 80) {
                message = message.substring(0, 80) + "...";


                if (child) {
                    child.innerHTML = message;
                } else {
                    messageRef.current.innerHTML = message;
                }
            }
        }
    },
        [messageRef]);

    return (


        <div className={`chat__conversation${props.active ? " chat__conversation__active" : ""}`} onClick={selectChat}>
            <img
                className="chat__conversation__avatar"
                src={imgUrl}
                alt="user avatar"
            />
            {/* <div className="chat__conversation__avatar"></div> */}
            <div className="flex flex--col flex--jc--center flex--grow ml-2">
                <div className="type--wgt--bold">{name}</div>
                <div ref={messageRef} className="aside-conversation-message" dangerouslySetInnerHTML={{ __html: lastMessage }}></div>
            </div>
            <div className="flex flex--col flex--jc--center flex--shrink flex--end">
                <div>
                    {unread && <div className="chat__conversation__dot"></div>}
                </div>
                <div className="type--color--secondary mt-3">
                    {lastMessageTime}
                </div>
            </div>
        </div>
    );
};

export default ConversationAside;
