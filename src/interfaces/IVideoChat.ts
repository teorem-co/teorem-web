export interface IProps {
    id?: number;
    onClick?: () => void;
    videoChatActivated: boolean;
}

export interface ContextType {
    callAccepted?: boolean;
    callEnded?: boolean;
    stream?: MediaStream;
    name?: string;
    call?: any;
    me?: string;
    myVideo?: any;
    userVideo?: any;
    connectionRef?: any;
    setName?: any;
    callUser?: any;
    leaveCall?: any;
    answerCall?: any;
    setStream?: any;
}

export interface IVideoPlayerModalProps {
    id?: string;
    children?: any;
    callId?: string;
    videoChatActivated: boolean;
}
