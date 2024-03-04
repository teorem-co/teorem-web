import React from 'react';

import { IChatConversation } from '../../../constants/chatConstants';

interface Props {
    data: IChatConversation;
}

const OtherUserMessage = (props: Props) => {
    const { messages, tutorImgUrl } = props.data;
    return (
        <div className="chat__message chat__message--other">
            {tutorImgUrl && (
                <img className="chat__conversation__avatar chat__conversation__avatar--small" src={tutorImgUrl} alt={'tutor profile avatar'} />
            )}
            {/* Messages */}
            <div className="flex flex--col">
                {messages.map((message: string, index: number) => (
                    <div className="w--80--max" key={index}>
                        <div className="chat__message__item chat__message__item--other">{message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OtherUserMessage;
