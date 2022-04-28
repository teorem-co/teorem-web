import { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks";
import { useLazyGetChatRoomsQuery, useLazyGetOnSearchChatRoomsQuery } from "../services/chatService";
import { addChatRooms, IChatRoom, setUser } from "../slices/chatSlice";
import ConversationAside from "./ConversationAside";

interface Props {
    data: IChatRoom[];
}

const AsideWrapper = (props: Props) => {

    const user = useAppSelector((state) => state.auth.user);

    const searchInputRef = useRef<HTMLInputElement>(null);

    const activeChat = useAppSelector((state) => state.chat.activeChatRoom);
    const chat = useAppSelector((state) => state.chat);

    const [page, setPage] = useState<number>(1);

    const [getSearchChat, { data: searchChatData, isSuccess: searchDataIsSuccess }] = useLazyGetOnSearchChatRoomsQuery();

    const [getChatRooms, { data: chatRooms, isSuccess: isSuccessChatRooms }] = useLazyGetChatRoomsQuery();

    const dispatch = useDispatch();

    useEffect(() => {

        if (isSuccessChatRooms) {
            dispatch(addChatRooms(chatRooms || null));
        }

    }, [isSuccessChatRooms]);

    const onSearch = () => {

        if (searchInputRef.current?.value && searchInputRef.current?.value.length > 0) {
            getSearchChat({
                search: searchInputRef.current?.value,
                page: page,
                rpp: 20
            });

        } else {
            getChatRooms({
                page: 1,
                rpp: chat.rpp,
                limitMessages: chat.rpp
            });
        }

    };

    return (
        <div className="card--chat__aside">
            <div className="p-4">
                <div className="type--wgt--bold type--lg">Chat</div>
                <input ref={searchInputRef} type="text" onKeyUp={onSearch} placeholder={t('CHAT.SEARCH_PLACEHOLDER')} className="input p-3 mt-6" />
            </div>
            <div className="chat__messages-wrapper">
                {(!searchDataIsSuccess || !(searchInputRef.current?.value && searchInputRef.current?.value.length > 0)) ? props.data.map((chatConversationItem: IChatRoom, index: number) => {

                    if (chatConversationItem.messages[chatConversationItem.messages.length - 1] && chatConversationItem.messages[chatConversationItem.messages.length - 1].message) {
                        const chatConversation = {
                            imgUrl: 'https://' + (user?.id != chatConversationItem.user?.userId ? 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg' : chatConversationItem.tutor?.userImage) + '',
                            name: (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userNickname : chatConversationItem.tutor?.userNickname) + '',
                            lastMessage: chatConversationItem.messages[chatConversationItem.messages.length - 1].message.message,
                            lastMessageTime: /*chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt*/ '',
                            unread: chatConversationItem.unreadMessageCount > 0
                        };

                        return (chatConversationItem.tutor?.userId == activeChat?.tutor?.userId && chatConversationItem.user?.userId == activeChat?.user?.userId) ? <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={true} /> : <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={false} />;
                    } else {

                        const chatConversation = {
                            imgUrl: 'https://' + (user?.id != chatConversationItem.user?.userId ? 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg' : chatConversationItem.tutor?.userImage) + '',
                            name: (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userNickname : chatConversationItem.tutor?.userNickname) + '',
                            lastMessage: "<i>Send a message to start a conversation</i>",
                            lastMessageTime: /*chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt*/ '',
                            unread: chatConversationItem.unreadMessageCount > 0
                        };

                        return (chatConversationItem.tutor?.userId == activeChat?.tutor?.userId && chatConversationItem.user?.userId == activeChat?.user?.userId) ? <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={true} /> : <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={false} />;

                    }

                }) : searchChatData && searchChatData.map((chatConversationItem: IChatRoom, index: number) => {

                    if (chatConversationItem.messages[chatConversationItem.messages.length - 1] && chatConversationItem.messages[chatConversationItem.messages.length - 1].message) {
                        const chatConversation = {
                            imgUrl: 'https://' + (user?.id != chatConversationItem.user?.userId ? 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg' : chatConversationItem.tutor?.userImage) + '',
                            name: (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userNickname : chatConversationItem.tutor?.userNickname) + '',
                            lastMessage: chatConversationItem.messages[chatConversationItem.messages.length - 1].message.message,
                            lastMessageTime: /*chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt*/ '',
                            unread: chatConversationItem.unreadMessageCount > 0
                        };

                        return (chatConversationItem.tutor?.userId == activeChat?.tutor?.userId && chatConversationItem.user?.userId == activeChat?.user?.userId) ? <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={true} /> : <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={false} />;
                    } else {

                        const chatConversation = {
                            imgUrl: 'https://' + (user?.id != chatConversationItem.user?.userId ? 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg' : chatConversationItem.tutor?.userImage) + '',
                            name: (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userNickname : chatConversationItem.tutor?.userNickname) + '',
                            lastMessage: "<i>Send a message to start a conversation</i>",
                            lastMessageTime: /*chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt*/ '',
                            unread: chatConversationItem.unreadMessageCount > 0
                        };

                        return (chatConversationItem.tutor?.userId == activeChat?.tutor?.userId && chatConversationItem.user?.userId == activeChat?.user?.userId) ? <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={true} /> : <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} active={false} />;

                    }

                })}
            </div>
        </div>
    );
};

export default AsideWrapper;
