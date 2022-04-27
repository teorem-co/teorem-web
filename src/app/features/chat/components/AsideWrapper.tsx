import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks";
import { useLazyGetOnSearchChatRoomsQuery } from "../services/chatService";
import { IChatRoom } from "../slices/chatSlice";
import ConversationAside from "./ConversationAside";

interface Props {
    data: IChatRoom[];
}

const AsideWrapper = (props: Props) => {

    const user = useAppSelector((state) => state.auth.user);

    const searchInputRef = useRef<HTMLInputElement>(null);

    const [page, setPage] = useState<number>(1);

    const [getSearchChat, { data: searchChatData, isSuccess: searchDataIsSuccess }] = useLazyGetOnSearchChatRoomsQuery();

    const onSearch = () => {

        if (searchInputRef.current?.value && searchInputRef.current?.value.length > 0) {
            getSearchChat({
                search: searchInputRef.current?.value,
                page: page,
                rpp: 20
            });

        } //else {

        //}

    };

    /*useEffect(() => {
        if (searchChatData) {
            //console.log(searchChatData);
        }
    }, [searchChatData]);*/

    return (
        <div className="card--chat__aside">
            <div className="p-4">
                <div className="type--wgt--bold type--lg">Chat</div>
                <input ref={searchInputRef} type="text" onInput={onSearch} placeholder="Search in chat" className="input p-3 mt-6" />
            </div>
            <div className="chat__messages-wrapper">
                {!searchDataIsSuccess ? props.data.map((chatConversationItem: IChatRoom, index: number) => {

                    const chatConversation = {
                        imgUrl: 'https://' + (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userImage : chatConversationItem.tutor?.userImage) + '',
                        name: (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userNickname : chatConversationItem.tutor?.userNickname) + '',
                        lastMessage: chatConversationItem.messages[chatConversationItem.messages.length - 1].message.message,
                        lastMessageTime: /*chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt*/ '',
                        unread: chatConversationItem.unreadMessageCount > 0
                    };
                    return <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} />;
                }) : searchChatData && searchChatData.map((chatConversationItem: IChatRoom, index: number) => {

                    const chatConversation = {
                        imgUrl: 'https://' + (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userImage : chatConversationItem.tutor?.userImage) + '',
                        name: (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userNickname : chatConversationItem.tutor?.userNickname) + '',
                        lastMessage: chatConversationItem.messages[chatConversationItem.messages.length - 1].message.message,
                        lastMessageTime: /*chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt*/ '',
                        unread: chatConversationItem.unreadMessageCount > 0
                    };
                    return <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} />;
                })}
            </div>
        </div>
    );
};

export default AsideWrapper;
