import React from 'react';

const LoggedUserMessage = () => {
    return (
        <div className="chat__message chat__message--logged">
            <div className="flex flex--col flex--end">
                <div>
                    <div className="chat__message__item chat__message__item--logged">
                        Message text text text
                        textsdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdf
                    </div>
                </div>
                <div>
                    <div className="chat__message__item chat__message__item--logged">
                        Message
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoggedUserMessage;
