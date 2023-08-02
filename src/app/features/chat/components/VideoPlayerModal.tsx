import React, { useContext } from 'react';
import {
  ContextType,
  IVideoPlayerModalProps,
} from '../../../../interfaces/IVideoChat';
import { SocketContext } from '../contexts/Context';

const VideoPlayerModal = (props: IVideoPlayerModalProps) => {

    const { me, callAccepted, name, setName, callEnded, leaveCall, myVideo, stream, callUser, setStream } = useContext<ContextType>(SocketContext);

    // useEffect(() => {
    //     (async () => {
    //
    //         console.log(navigator, navigator.mediaDevices);
    //
    //         alert("on call id changed");
    //         if (typeof callUser !== "undefined" && stream)
    //             callUser(props.callId);
    //
    //     })();
    // }, [props.callId]);

    return null;

    // return (
    //     <div className="video-chat-wrapper">
    //         <VideoPlayer videoChatActivated={props.videoChatActivated} />
    //     </div>
    // );
};

export default VideoPlayerModal;

