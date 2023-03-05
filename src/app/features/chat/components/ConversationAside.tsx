import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { IChatConversationItem } from '../../../constants/chatConstants';
import { IChatRoom, setActiveChatRoom } from '../slices/chatSlice';
import ImageCircle from '../../../components/ImageCircle';

interface Props {
    data: IChatConversationItem;
    chat: IChatRoom;
    active?: boolean;
}

const ConversationAside = (props: Props) => {
    const { t } = useTranslation();
    const { imgUrl, name, lastMessage, lastMessageTime, unread } = props.data;

    const messageRef = useRef<HTMLDivElement>(null);

    const [messageDisplay, setMessageDisplay] = useState<string>('');
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
                message = message.substring(0, 80) + '...';

                if (child) {
                    child.innerHTML = message;
                } else {
                    messageRef.current.innerHTML = message;
                }
            }
        }
    }, [messageRef]);

    useEffect(() => {
        let textMessage = lastMessage.substring(0, 70) + "...";
        textMessage = textMessage.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
            return t(token);
        });
        textMessage = textMessage.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
            return name;
        });

        setMessageDisplay(textMessage);
    }, [lastMessage]);

    return (
        <div className={`chat__conversation${props.active ? ' chat__conversation__active' : ''}`} onClick={selectChat} style={{position: "relative"}}>
            {typeof imgUrl === "string" ? (<img className="chat__conversation__avatar" src={imgUrl} alt="user avatar" />) : (
                <ImageCircle initials={`${props.chat.user?.userNickname.split(" ")[0].charAt(0)}${props.chat.user?.userNickname.split(" ")[1].charAt(0)}`} />
            )}
            {/* <div className="chat__conversation__avatar"></div> */}
            <div className="flex flex--col flex--jc--center flex--grow ml-2">
                <div className="type--wgt--bold">{name}</div>
                <div ref={messageRef} className="aside-conversation-message" dangerouslySetInnerHTML={{ __html: messageDisplay }}></div>
            </div>
            <div className="flex flex--col flex--jc--center flex--shrink flex--end">
                <div className="type--sm type--color--secondary mt-3">{lastMessageTime}</div>
                <div>{unread && <div className="chat__conversation__dot mt-3"></div>}</div>
            </div>
        </div>
    );
};

export default ConversationAside;
