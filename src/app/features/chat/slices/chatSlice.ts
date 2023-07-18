import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { StaticRouter } from 'react-router';
import { SignalData } from "simple-peer";
import { io, Socket } from 'socket.io-client';
import { compileString } from 'sass';
import { RootState, store } from '../../../store';
import { useSelector } from 'react-redux';

const serverUrl = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`; //TODO: set to our
const javaSocketServerUrl = "https://localhost:8085";
const token = 'token'; // TODO: set token (jwt?)
//const token = store.getState().auth.token;
export interface IVideoChatBuffer {
    userId: string;
    tutorId: string;
    senderId: string;
    link: string;
    signalData?: SignalData;
}

export interface IChatProfile {
    userId: string;
    userNickname: string;
    userImage: string;
}

export interface IChatMessage {

    messageId?: string;
    messageNew?: boolean;
    messageMissedCall?: boolean;
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
    newMessages: number | null;
    activeChatRoom: IChatRoom | null;
    socket: Socket;
    rpp: number;
    freeConsultation: boolean | null;
    link: string | null;
    buffer: IVideoChatBuffer | null;
    consultationInitialized: boolean | null;
}

export interface IChatRoomIdSet {
    userId: string;
    tutorId: string;
}

export interface IGetMessagesIdSet {
    userId: string;
    tutorId: string;

    messages: ISendChatMessage[];
}

export interface IReadMessagePair{
    tutorId: string,
    studentId: string
}

const initialState: IState = {
    user: null,
    chatRooms: [],
    newMessages: 0,
    activeChatRoom: null,
    socket: io(`${javaSocketServerUrl}?token=${token}`), //io(`${serverUrl}`),
    rpp: 20,
    freeConsultation: false,
    link: null,
    consultationInitialized: null,
    buffer: null,
};


export const filterArrayUnique = (arr: Array<any>, prop: string) => {
    const set = new Set;
    return arr.filter(o => !set.has(o[prop]) && set.add(o[prop]));
};

export const filterArrayUniqueMessages = (arr: Array<ISendChatMessage>) => {
    const set = new Set;
    return arr.filter(o => {
        if (o.message.messageMissedCall)
            return true;
        return !set.has(o.message.messageId) && set.add(o.message.messageId);
    });
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
            if (action.payload)
                state.activeChatRoom = action.payload;

        },

        setActiveChatRoomById(state, action: PayloadAction<IChatRoomIdSet | null>) {
            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {

                    if (state.chatRooms[i].user?.userId == action.payload.userId && state.chatRooms[i].tutor?.userId == action.payload.tutorId) {
                        state.activeChatRoom = state.chatRooms[i];
                        return;
                    }
                }
            }
        },

        setFreeConsultation(state, action: PayloadAction<boolean>) {

            state.freeConsultation = action.payload;
        },

        setLink(state, action: PayloadAction<string | null>) {

            state.link = action.payload;
        },

        setConsultationInitialized(state, action: PayloadAction<boolean>) {

            state.consultationInitialized = action.payload;
        },

        setBuffer(state, action: PayloadAction<IVideoChatBuffer>) {
            state.buffer = action.payload;
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

                if (state.newMessages != null)
                    state.newMessages += unreadMessages;
                else
                    state.newMessages = unreadMessages;

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

                            if (state.newMessages != null)
                                state.newMessages += 1;
                            else
                                state.newMessages = 1;
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

                                if (state.newMessages != null)
                                    state.newMessages += 1;
                                else
                                    state.newMessages = 1;
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

        getMessagesById(state, action: PayloadAction<IGetMessagesIdSet>) {
            for (let i = 0; i < state.chatRooms.length; i++) {

                if (state.chatRooms[i].user?.userId == action.payload.userId && state.chatRooms[i].tutor?.userId == action.payload.tutorId) {

                    let messages: ISendChatMessage[] = [...state.chatRooms[i].messages, ...action.payload.messages];

                    const messageIds = new Set<string>();
                    messages = messages.filter((message: ISendChatMessage) => {
                        if (!message.message.messageId)
                            return true;

                        if (message.message.messageId && !messageIds.has(message.message.messageId)) {
                            messageIds.add(message.message.messageId);
                            return true;
                        }

                        return false;
                    });

                    messages.sort((a: ISendChatMessage, b: ISendChatMessage) =>
                        new Date(a.message.createdAt) > new Date(b.message.createdAt) ? 1 : -1
                    );

                    state.chatRooms[i].messages = messages;

                    if (state.activeChatRoom)
                        state.activeChatRoom.messages = messages;
                }
            }
        },

        addMessage(state, action: PayloadAction<ISendChatMessage | null>) {
            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {
                    for (let j = 0; j < state.chatRooms[i].messages.length; j++) {

                        if (!action.payload.message.messageMissedCall && !action.payload.message.messageNew && state.chatRooms[i].messages[j].message.messageId == action.payload.message.messageId) {
                            return;
                        }
                    }


                    if (state.chatRooms[i].tutor?.userId == action.payload.tutorId && state.chatRooms[i].user?.userId == action.payload.userId) {
                        state.chatRooms[i].messages.push(action.payload);

                        if (state.chatRooms[i].tutor?.userId == state.activeChatRoom?.tutor?.userId && state.chatRooms[i].user?.userId == state.activeChatRoom?.user?.userId) {
                            state.activeChatRoom?.messages.push(action.payload);

                            if ((action.payload.message.messageMissedCall && !action.payload.message.messageNew) && state.activeChatRoom) {
                                state.activeChatRoom.unreadMessageCount += 1;
                            }

                            if (action.payload.message.messageMissedCall && state.activeChatRoom) {
                                state.activeChatRoom.unreadMessageCount += 1;
                            }
                        }

                        if (!action.payload.message.messageNew) {
                            state.chatRooms[i].unreadMessageCount += 1;

                            if (state.newMessages != null)
                                state.newMessages += 1;
                            else
                                state.newMessages = 1;
                        }

                        if (action.payload.message.messageMissedCall) {
                            state.chatRooms[i].unreadMessageCount += 1;
                            if (state.activeChatRoom) {
                                if (state.activeChatRoom.unreadMessageCount)
                                    state.activeChatRoom.unreadMessageCount += 1;
                                else
                                    state.activeChatRoom.unreadMessageCount = 1;

                            }

                            if (state.newMessages != null)
                                state.newMessages += 1;
                            else
                                state.newMessages = 1;
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

                            if ((state.chatRooms[i].messages[j].message.messageNew && !state.chatRooms[i].messages[j].message.messageMissedCall) || state.chatRooms[i].messages[j].message.isRead)
                                return;

                            state.chatRooms[i].messages[j].message.isRead = true;
                            state.chatRooms[i].unreadMessageCount = Math.max(0, state.chatRooms[i].unreadMessageCount - 1);

                            if (state.newMessages != null){
                                state.newMessages -= 1;
                            }

                        else
                                state.newMessages = 0;
                            if (!(state.chatRooms[i].messages[j].message.messageNew && !state.chatRooms[i].messages[j].message.messageMissedCall) && state.activeChatRoom?.tutor?.userId == state.chatRooms[i].messages[j].tutorId && state.activeChatRoom?.user?.userId == state.chatRooms[i].messages[j].userId) {
                                state.activeChatRoom.unreadMessageCount = Math.max(0, state.activeChatRoom.unreadMessageCount - 1);
                            }

                            if (state.chatRooms[i].messages[j].message.messageId)
                                state.socket.emit('readMessage', state.chatRooms[i].messages[j]);
                            return;
                        }
                    }
                }
            }
        },

        readMessages(state, action: PayloadAction<IChatRoomIdSet | null>) {
            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {
                    if (state.chatRooms[i].user?.userId == action.payload.userId && state.chatRooms[i].tutor?.userId == action.payload.tutorId) {
                        state.socket.emit('readMessages', { ...action.payload, readerId: state.user?.userId });
                        state.chatRooms[i].unreadMessageCount = 0;

                        for (let j = 0; j < state.chatRooms[i].messages.length; j++) {
                            state.chatRooms[i].messages[j].message.isRead;   //TODO: check this because it sets that messages are read,
                                                                                    // but sometimes are not

                            if (state.newMessages != null && state.newMessages != 0){
                                state.newMessages -= 1;
                            }

                            else
                                state.newMessages = 0;
                        }
                    }
                }
                return state;
            }
        },

        addChatRoom(state, action: PayloadAction<IChatRoom | null>) {
            if (action.payload) {

                let missedCall = false;
                let inside = false;

                for (let i = 0; i < state.chatRooms.length; i++) {

                    if (state.chatRooms[i].tutor?.userId == action.payload.tutor?.userId && state.chatRooms[i].user?.userId == action.payload.user?.userId) {

                        inside = true;

                        for (let j = 0; j < action.payload.messages.length; j++) {

                            state.chatRooms[i].messages.find((x: ISendChatMessage) => {

                                if (action.payload?.messages[j].message.messageMissedCall && action.payload?.messages[j].message.messageNew) {

                                    missedCall = true;
                                }

                                return  x.message.messageId == action.payload?.messages[j].message.messageId
                                    && !action.payload?.messages[j].message.messageMissedCall
                                    && action.payload?.messages[j].message.messageNew;
                            });

                            if (missedCall)
                                break;
                        }

                        // state.chatRooms[i].messages = filterArrayUniqueMessages(state.chatRooms[i].messages.concat(action.payload?.messages)).sort((a: ISendChatMessage, b: ISendChatMessage) =>
                        //     new Date(a.message.createdAt) > new Date(b.message.createdAt) ? 1 : -1
                        // );

                        state.chatRooms[i].messages = state.chatRooms[i].messages.concat(action.payload?.messages).sort((a: ISendChatMessage, b: ISendChatMessage) =>
                            new Date(a.message.createdAt) > new Date(b.message.createdAt) ? 1 : -1
                        );

                        state.activeChatRoom = state.chatRooms[i];
                        break;
                    }
                };



                if (!missedCall) {

                    if (!inside) {
                        state.chatRooms.push(action.payload);
                        state.activeChatRoom = state.chatRooms[state.chatRooms.length - 1];
                    }
                }

                if (state.newMessages) {
                    if (action.payload.unreadMessageCount > 0)
                        state.newMessages += action.payload.unreadMessageCount;
                } else {
                    state.newMessages = action.payload.unreadMessageCount;
                }

            }
        },

        setMessagesAsRead(state,action: PayloadAction<IReadMessagePair | null>){

            const tutorId = action.payload?.tutorId;
            const studentId = action.payload?.studentId;

            if (action.payload) {

                for (let i = 0; i < state.chatRooms.length; i++) {
                    if (state.chatRooms[i].user?.userId == studentId && state.chatRooms[i].tutor?.userId == tutorId) {
                        //state.socket.emit('readMessages', { ...action.payload, readerId: state.user?.userId });
                        state.chatRooms[i].unreadMessageCount = 0;

                        for (let j = 0; j < state.chatRooms[i].messages.length; j++) {
                            if(state.activeChatRoom){
                                for (let j = 0; j < state.activeChatRoom.messages.length; j++) {
                                    state.activeChatRoom.messages[j].message.isRead = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
});

export const {
    setUser,
    setActiveChatRoom,
    setActiveChatRoomById,
    setConsultationInitialized,
    setBuffer,
    setFreeConsultation,
    setLink,
    addChatRooms,
    getMessage,
    getMessages,
    getMessagesById,
    addMessage,
    readMessage,
    readMessages,
    addChatRoom,
    setMessagesAsRead
} = chatSlice.actions;
export default chatSlice.reducer;
