import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { StaticRouter } from 'react-router';
import { io, Socket } from 'socket.io-client';

const serverUrl = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`;
export interface IChatProfile {
    userId: string;
    userNickname: string;
    userImage: string;
}

export interface IChatMessage {

    messageId?: string;
    messageNew?: boolean;
    message: string;
    createdAt: Date;
    isRead: boolean;
    isFile?: boolean;
}

export interface ISendChatMessage {
    userId: string;
    tutorId: string;
    message: IChatMessage;
    senderId?: string;

}

export interface IChatRoom {
    tutor?: IChatProfile;
    user?: IChatProfile;
    messages: Array<ISendChatMessage>;
    unreadMessageCount: number;
}
export interface IState {
    user: IChatProfile | null;
    chatRooms: Array<IChatRoom>;
    newMessages: number;
    activeChatRoom: IChatRoom | null;
    socket: Socket;
    rpp: number;
    freeConsultation: boolean;
    link: string | null;
}

const initialState: IState = {
    user: null,
    chatRooms: [],
    newMessages: 0,
    activeChatRoom: null,
    socket: io(serverUrl),
    rpp: 20,
    freeConsultation: false,
    link: null
};


export const filterArrayUnique = (arr: Array<any>, prop: string) => {
    const set = new Set;
    return arr.filter(o => !set.has(o[prop]) && set.add(o[prop]));
};

export const filterArrayUniqueMessages = (arr: Array<ISendChatMessage>) => {
    const set = new Set;
    return arr.filter(o => !set.has(o.message.messageId) && set.add(o.message.messageId));
};

//RESET STATE AFTER SUCCESFUL LOGIN/REGISTER
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

        setUser(state, action: PayloadAction<IChatProfile | null>) {
            state.user = action.payload;
        },

        setActiveChatRoom(state, action: PayloadAction<IChatRoom | null>) {

            state.activeChatRoom = action.payload;
        },

        setFreeConsultation(state, action: PayloadAction<boolean>) {

            state.freeConsultation = action.payload;
        },

        setLink(state, action: PayloadAction<string | null>) {

            state.link = action.payload;
        },

        addChatRooms(state, action: PayloadAction<Array<IChatRoom> | null>) {

            if (action.payload) {
                let unreadMessages = 0;
                for (let j = 0; j < action.payload.length; j++) {

                    let inside = false;
                    for (let i = 0; i < state.chatRooms.length; i++) {

                        if (state.chatRooms[i].tutor?.userId == action.payload[j].tutor?.userId && state.chatRooms[i].user?.userId == action.payload[j].user?.userId) {

                            state.chatRooms[i].messages = filterArrayUniqueMessages(state.chatRooms[i].messages.concat(action.payload[j].messages));

                            inside = true;
                        }
                    }

                    if (!inside)
                        state.chatRooms.push(action.payload[j]);

                    unreadMessages += action.payload[j].unreadMessageCount;
                }

                state.newMessages += unreadMessages;
            }
        },
        getMessage(state, action: PayloadAction<ISendChatMessage | null>) {

            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {
                    if (state.chatRooms[i].tutor?.userId == action.payload.tutorId) {

                        for (let j = 0; j < state.chatRooms[i].messages.length; j++) {

                            if (state.chatRooms[i].messages[j].message.messageId === action.payload.message.messageId) {
                                return;
                            }
                        }

                        state.chatRooms[i].messages.push(action.payload);

                        if (state.chatRooms[i].tutor?.userId == action.payload.senderId) {
                            state.chatRooms[i].unreadMessageCount += 1;

                            state.newMessages += 1;

                            return;
                        }
                    }
                }
            }
        },
        getMessages(state, action: PayloadAction<ISendChatMessage[] | null>) {

            if (action.payload) {


                for (let i = 0; i < state.chatRooms.length; i++) {

                    const newMessages = [];

                    for (let k = 0; k < action.payload.length; k++) {

                        if (state.chatRooms[i].tutor?.userId == action.payload[k].tutorId) {

                            let inside = false;
                            for (let j = 0; j < state.chatRooms[i].messages.length; j++) {

                                if (state.chatRooms[i].messages[j].message.messageId === action.payload[k].message.messageId) {
                                    inside = true;
                                    break;
                                }
                            }

                            if (inside)
                                break;

                            newMessages.push(action.payload[k]);

                            if (state.activeChatRoom)
                                state.activeChatRoom.messages.push(action.payload[k]);

                            if (state.chatRooms[i].tutor?.userId == action.payload[k].senderId && !action.payload[k].message.isRead) {
                                state.chatRooms[i].unreadMessageCount += 1;

                                state.newMessages += 1;

                                break;
                            }
                        }
                    }

                    state.chatRooms[i].messages = [...newMessages, ...state.chatRooms[i].messages];
                    if (state.activeChatRoom)
                        state.activeChatRoom.messages = [...newMessages, ...state.activeChatRoom.messages];

                }
            }
        },
        addMessage(state, action: PayloadAction<ISendChatMessage | null>) {

            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {
                    for (let j = 0; j < state.chatRooms[i].messages.length; j++) {

                        if (!state.chatRooms[i].messages[j].message.messageNew && state.chatRooms[i].messages[j].message.messageId == action.payload.message.messageId) {
                            return;
                        }
                    }

                    if (state.chatRooms[i].tutor?.userId == action.payload.tutorId && state.chatRooms[i].user?.userId == action.payload.userId) {
                        state.chatRooms[i].messages.push(action.payload);

                        if (state.chatRooms[i].tutor?.userId == state.activeChatRoom?.tutor?.userId && state.chatRooms[i].user?.userId == state.activeChatRoom?.user?.userId) {
                            state.activeChatRoom?.messages.push(action.payload);
                            if (!action.payload.message.messageNew && state.activeChatRoom)
                                state.activeChatRoom.unreadMessageCount += 1;
                        }

                        if (!action.payload.message.messageNew) {
                            state.chatRooms[i].unreadMessageCount += 1;


                            state.newMessages += 1;
                        }

                        return;
                    }
                }

            }
        },
        readMessage(state, action: PayloadAction<ISendChatMessage | null>) {

            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {
                    for (let j = 0; j < state.chatRooms[i].messages.length; j++) {
                        if (state.chatRooms[i].messages[j].message.messageId == action.payload.message.messageId) {

                            if (state.chatRooms[i].messages[j].message.messageNew || state.chatRooms[i].messages[j].message.isRead)
                                return;
                            state.chatRooms[i].messages[j].message.isRead = true;
                            state.chatRooms[i].unreadMessageCount -= 1;
                            state.newMessages -= 1;

                            if (!state.chatRooms[i].messages[j].message.messageNew && state.activeChatRoom?.tutor?.userId == state.chatRooms[i].messages[j].tutorId && state.activeChatRoom?.user?.userId == state.chatRooms[i].messages[j].userId) {
                                state.activeChatRoom.unreadMessageCount -= 1;
                            }

                            state.socket.emit('readMessage', state.chatRooms[i].messages[j]);
                            return;
                        }
                    }
                }
            }
        },

        addChatRoom(state, action: PayloadAction<IChatRoom | null>) {

            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {

                    if (state.chatRooms[i].tutor?.userId == action.payload.tutor?.userId && state.chatRooms[i].user?.userId == action.payload.user?.userId) {
                        return;
                    }
                }

                if (action.payload.user?.userId == state.user?.userId)
                    state.activeChatRoom = action.payload;

                state.chatRooms.push(action.payload);

                /*if (state.user?.userId != action.payload.user?.userId)
                    state.newMessages += 1;*/
            }
        },
    },
});

export const { setUser, setActiveChatRoom, setFreeConsultation, setLink, addChatRooms, getMessage, getMessages, addMessage, readMessage, addChatRoom } = chatSlice.actions;
export default chatSlice.reducer;
