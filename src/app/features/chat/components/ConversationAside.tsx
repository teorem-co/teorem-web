import React from 'react';

import { IChatConversationItem } from '../../../constants/chatConstants';

interface Props {
    data: IChatConversationItem;
}

const ConversationAside = (props: Props) => {
    const { imgUrl, name, lastMessage, lastMessageTime, unread } = props.data;

    return (
        <div className="chat__conversation">
            <img
                className="chat__conversation__avatar"
                src={imgUrl}
                alt="user avatar"
            />
            {/* <div className="chat__conversation__avatar"></div> */}
            <div className="flex flex--col flex--jc--center flex--grow ml-2">
                <div className="type--wgt--bold">{name}</div>
                <div>{lastMessage}</div>
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
