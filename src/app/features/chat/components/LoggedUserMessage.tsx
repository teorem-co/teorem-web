import React from 'react';

import { IChatConversation } from '../../../constants/chatConstants';

interface Props {
    data: IChatConversation;
}
const LoggedUserMessage = (props: Props) => {
    const { messages } = props.data;
    return (
        <div className="chat__message chat__message--logged">
            <div className="flex flex--col flex--end">
                {messages.map((message: string, index: number) => (
                    <div className="type--right w--80--max" key={index}>
                        <div className="chat__message__item chat__message__item--logged">
                            {message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoggedUserMessage;
