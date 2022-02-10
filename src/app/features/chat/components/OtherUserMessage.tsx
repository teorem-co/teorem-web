import React from 'react';

const OtherUserMessage = () => {
    return (
        <div className="chat__message chat__message--other">
            <div className="chat__conversation__avatar chat__conversation__avatar--small"></div>
            {/* Messages */}
            <div className="flex flex--col">
                <div>
                    <div className="chat__message__item chat__message__item--other">
                        Message text text text text
                    </div>
                </div>
                <div>
                    <div className="chat__message__item chat__message__item--other">
                        Message
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherUserMessage;
