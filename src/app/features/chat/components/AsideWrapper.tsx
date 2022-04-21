import { useAppSelector } from "../../../hooks";
import { IChatRoom } from "../slices/chatSlice";
import ConversationAside from "./ConversationAside";

interface Props {
    data: IChatRoom[];
}

const AsideWrapper = (props: Props) => {

    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="card--chat__aside">
            <div className="p-4">
                <div className="type--wgt--bold type--lg">Chat</div>
                <input type="text" placeholder="Search in chat" className="input p-3 mt-6" />
            </div>
            <div className="chat__messages-wrapper">
                {props.data.map((chatConversationItem: IChatRoom, index: number) => {

                    if (chatConversationItem.messages[chatConversationItem.messages.length - 1] && chatConversationItem.messages[chatConversationItem.messages.length - 1].message) {
                        const chatConversation = {
                            imgUrl: 'https://' + (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userImage : chatConversationItem.tutor?.userImage) + '',
                            name: (user?.id != chatConversationItem.user?.userId ? chatConversationItem.user?.userNickname : chatConversationItem.tutor?.userNickname) + '',
                            lastMessage: chatConversationItem.messages[chatConversationItem.messages.length - 1].message.message,
                            lastMessageTime: /*chatConversationItem.messages[chatConversationItem.messages.length - 1].message.createdAt*/ '',
                            unread: chatConversationItem.unreadMessageCount > 0
                        };
                        return <ConversationAside key={index} chat={chatConversationItem} data={chatConversation} />;
                    }
                })}
            </div>
        </div>
    );
};

export default AsideWrapper;
