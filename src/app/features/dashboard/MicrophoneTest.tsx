import React, { useEffect, useState } from 'react';

interface Props {
    deviceId: string;
    className?: string;
}

export const MicrophoneTest = (props: Props) => {
    const { deviceId, className } = props;
    const [audioLevel, setAudioLevel] = useState(0);
    let stream: MediaStream | null = null;

    const getUserMedia = async () => {
        try {
            // Request access to the microphone
            stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: deviceId } },
                video: false,
            });

            // Create an AudioContext
            const audioContext = new window.AudioContext();

            // Create an AnalyserNode
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            // Connect the source to the analyser and the analyser to the destination
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            // analyser.connect(audioContext.destination);

            // Buffer to hold the audio data for analysis
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Function to update the visual feedback
            const updateFeedback = () => {
                analyser.getByteFrequencyData(dataArray);

                // Simple volume calculation based on frequency data
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;

                // Update state with the calculated volume level
                setAudioLevel(average);

                // Keep updating the feedback while component is mounted
                requestAnimationFrame(updateFeedback);
            };

            // Start updating the visual feedback
            updateFeedback();
        } catch (err) {
            console.error('Error accessing the microphone', err);
        }
    };

    useEffect(() => {
        getUserMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => {
                    console.log('Stopping mic track');
                    track.stop();
                });
            }
        };
    }, [deviceId]);

    return (
        <div className={'w--100 background-red'} style={{ height: '10px', backgroundColor: 'lightgray' }}>
            <div
                className={`${className}`}
                style={{
                    height: '10px',
                    width: `${audioLevel}px`,
                    backgroundColor: 'green',
                }}
            ></div>
        </div>
    );
};

export default MicrophoneTest;
