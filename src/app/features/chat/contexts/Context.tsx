import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { ContextType } from "../../../../interfaces/IVideoChat";
import { useAppSelector } from "../../../hooks";
// import { Stream } from "stream";

const defaultValues: ContextType = {
    callAccepted: false,
    callEnded: false,
    stream: undefined,
    name: "defaultName",
    call: null,
    me: "defaultMe",
    myVideo: null,
    userVideo: null,
    connectionRef: null,
    setName: () => { console.log(""); },
    callUser: () => { console.log(""); },
    leaveCall: () => { console.log(""); },
    answerCall: () => { console.log(""); },
    setStream: () => { console.log(""); },
};
export const SocketContext = createContext<ContextType>(defaultValues);

//const socket = io('https://localhost:5000');
//const socket = io('https://warm-wildwood-81069.herokuapp.com');

interface IContextProps {
    children: JSX.Element[] | any;
}

export const ContextProvider = (props: IContextProps) => {
    const [callAccepted, setCallAccepted] = useState<boolean>(false);
    const [callEnded, setCallEnded] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [name, setName] = useState<string>('');
    const [call, setCall] = useState<any>({});
    const [me, setMe] = useState<string>('');

    const myVideo = useRef<any>();
    const userVideo = useRef<any>();
    const connectionRef = useRef<any>();

    const socket = useAppSelector((state) => state.chat.socket);

    useEffect(() => {

        // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        //     .then((currentStream) => {
        //         setStream(currentStream);
        //
        //         myVideo.current.srcObject = currentStream;
        //     });

        socket.on('me', (id) => setMe(id));

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });
    }, []);

    const answerCall = () => {
        setCallAccepted(true);

        alert("on answer call");
        if (stream) {
            const peer = new Peer({ initiator: false, trickle: false, stream });

            peer.on('signal', (data) => {
                socket.emit('answerCall', { signal: data, to: call.from });
            });

            peer.on('stream', (currentStream) => {
                userVideo.current.srcObject = currentStream;
            });

            peer.signal(call.signal);

            connectionRef.current = peer;
        }


    };


    const callUser = (id: string) => {

        alert("on call user");
        if (stream) {
            const peer = new Peer({ initiator: true, trickle: false, stream });

            peer.on('signal', (data) => {
                socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
            });

            peer.on('stream', (currentStream) => {
                userVideo.current.srcObject = currentStream;
            });

            socket.on('callAccepted', (signal) => {
                setCallAccepted(true);

                peer.signal(signal);
            });

            connectionRef.current = peer;
        }

    };

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    };

    return (
            <SocketContext.Provider value={{
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream: stream ? stream : undefined,
                name,
                setName,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall,
                setStream,
            }
            }
            >
                {props.children}
            </SocketContext.Provider>
        // <>
        //     {stream && <SocketContext.Provider value={{
        //         call,
        //         callAccepted,
        //         myVideo,
        //         userVideo,
        //         stream,
        //         name,
        //         setName,
        //         callEnded,
        //         me,
        //         callUser,
        //         leaveCall,
        //         answerCall,
        //         setStream,
        //     }
        //     }
        //     >
        //         {props.children}
        //     </SocketContext.Provider>}
        // </>

    );
};

