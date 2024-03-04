import { useContext } from 'react';
import { ContextType, IProps } from '../../../../interfaces/IVideoChat';
import { SocketContext } from '../contexts/Context';

const VideoPlayer = (props: IProps) => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext<ContextType>(SocketContext);

    return null;

    // return (
    //   <div className={`video-container ${props.videoChatActivated ? 'video-container-disabled' : ''}`}>
    //     <div className="video-inner-container">
    //       <div>
    //         <h5>{name || 'Name'}</h5>
    //         <video playsInline muted ref={myVideo} autoPlay className="video-player" />
    //       </div>
    //     </div>
    //     {callAccepted && !callEnded && (
    //       <div className="video-inner-container">
    //         <div>
    //           <h5>{call.name || 'Name'}</h5>
    //           <video playsInline ref={userVideo} autoPlay className="video-player" />
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // );
};

export default VideoPlayer;
