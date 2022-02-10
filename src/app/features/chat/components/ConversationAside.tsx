import React from 'react';

const ConversationAside = () => {
    return (
        <div className="chat__conversation">
            <div className="chat__conversation__avatar"></div>
            <div className="flex flex--col flex--jc--center flex--grow ml-2">
                <div className="type--wgt--bold">Name Lastname</div>
                <div>Some mesage text .....</div>
            </div>
            <div className="flex flex--col flex--jc--center flex--shrink">
                <div>
                    <div className="chat__conversation__dot"></div>
                </div>
                <div className="type--color--secondary mt-3">5 m</div>
            </div>
        </div>
    );
};

export default ConversationAside;
