import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, X, Clock } from 'lucide-react';
import {
    initiateCall,
    saveOffer,
    saveAnswer,
    addIceCandidate,
    endCall,
    listenToCall,
    ICE_SERVERS
} from '../../services/videoCallService';
import './VideoCall.css';

const VideoCall = ({ tripId, currentUser, companionName, addToast, onClose }) => {
    const [callState, setCallState] = useState('idle'); // idle, calling, incoming, connected, ended
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [remoteCallData, setRemoteCallData] = useState(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const callTimerRef = useRef(null);

    // Listen to call state from Firestore
    useEffect(() => {
        if (!tripId) return;

        const unsubscribe = listenToCall(tripId, (data) => {
            setRemoteCallData(data);

            if (!data.exists) {
                // Call ended or doesn't exist
                if (callState === 'connected' || callState === 'calling') {
                    handleCallEnded();
                }
                return;
            }

            // Incoming call
            if (data.status === 'calling' && data.callerId !== currentUser.uid && callState === 'idle') {
                setCallState('incoming');
            }

            // Call connected (answer received)
            if (data.answer && callState === 'calling') {
                handleAnswerReceived(data.answer);
            }

            // Handle ICE candidates
            if (data.calleeCandidates && callState === 'calling') {
                data.calleeCandidates.forEach(candidate => {
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                });
            }
            if (data.callerCandidates && callState === 'connected') {
                data.callerCandidates.forEach(candidate => {
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                });
            }
        });

        return () => unsubscribe();
    }, [tripId, currentUser.uid, callState]);

    // Call duration timer
    useEffect(() => {
        if (callState === 'connected') {
            callTimerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
            setCallDuration(0);
        }

        return () => {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
        };
    }, [callState]);

    // 5-minute reminder
    useEffect(() => {
        if (callDuration === 300) { // 5 minutes
            addToast('⏰ You\'ve been on the call for 5 minutes!', 'info');
        }
    }, [callDuration, addToast]);

    const setupLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            addToast('Camera/microphone access denied', 'error');
            throw error;
        }
    };

    const createPeerConnection = useCallback((isCaller) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                addIceCandidate(tripId, event.candidate, isCaller);
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                setCallState('connected');
                addToast('📹 Connected! Enjoy your vibe check!', 'success');
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                handleCallEnded();
            }
        };

        return pc;
    }, [tripId, addToast]);

    const startCall = async () => {
        try {
            setCallState('calling');

            const stream = await setupLocalStream();
            const pc = createPeerConnection(true);
            peerConnectionRef.current = pc;

            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            await initiateCall(tripId, currentUser.uid, currentUser.displayName || 'User');

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await saveOffer(tripId, offer);

            addToast('📞 Calling companion...', 'info');
        } catch (error) {
            console.error('Error starting call:', error);
            setCallState('idle');
            addToast('Failed to start call', 'error');
        }
    };

    const answerCall = async () => {
        try {
            setCallState('connected');

            const stream = await setupLocalStream();
            const pc = createPeerConnection(false);
            peerConnectionRef.current = pc;

            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            if (remoteCallData?.offer) {
                await pc.setRemoteDescription(new RTCSessionDescription(remoteCallData.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await saveAnswer(tripId, answer);
            }
        } catch (error) {
            console.error('Error answering call:', error);
            setCallState('idle');
            addToast('Failed to answer call', 'error');
        }
    };

    const handleAnswerReceived = async (answer) => {
        try {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(
                    new RTCSessionDescription(answer)
                );
                setCallState('connected');
            }
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    };

    const handleCallEnded = () => {
        // Cleanup
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        setCallState('idle');
        setRemoteCallData(null);
    };

    const hangUp = async () => {
        try {
            await endCall(tripId);
            handleCallEnded();
            addToast('Call ended', 'info');
        } catch (error) {
            console.error('Error ending call:', error);
        }
    };

    const declineCall = async () => {
        try {
            await endCall(tripId);
            setCallState('idle');
            setRemoteCallData(null);
        } catch (error) {
            console.error('Error declining call:', error);
        }
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = isMuted;
                setIsMuted(!isMuted);
            }
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = isVideoOff;
                setIsVideoOff(!isVideoOff);
            }
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-call-container dark:bg-slate-900 dark:text-slate-100">
            <div className="video-call-header dark:border-slate-800">
                <div className="video-title">
                    <Video size={24} />
                    <h2>Vibe Check</h2>
                </div>
                <button className="video-close-btn dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="video-content">
                {callState === 'idle' && (
                    <div className="call-idle dark:bg-slate-800/50">
                        <div className="idle-icon">
                            <Video size={64} />
                        </div>
                        <h3>Quick Video Call</h3>
                        <p>Have a 5-minute "vibe check" with your travel companion before sharing contact details!</p>
                        <button className="start-call-btn dark:bg-green-600 dark:text-white" onClick={startCall}>
                            <Phone size={20} />
                            Start Call
                        </button>
                    </div>
                )}

                {callState === 'calling' && (
                    <div className="call-calling dark:bg-slate-800">
                        <div className="calling-animation">
                            <div className="calling-ring"></div>
                            <div className="calling-ring"></div>
                            <div className="calling-ring"></div>
                            <span className="calling-avatar">{companionName?.charAt(0) || 'C'}</span>
                        </div>
                        <h3>Calling {companionName || 'Companion'}...</h3>
                        <p>Waiting for them to answer</p>
                        <button className="cancel-call-btn" onClick={hangUp}>
                            <PhoneOff size={20} />
                            Cancel
                        </button>
                    </div>
                )}

                {callState === 'incoming' && (
                    <div className="call-incoming dark:bg-slate-800">
                        <div className="incoming-animation">
                            <span className="incoming-avatar">{remoteCallData?.callerName?.charAt(0) || 'C'}</span>
                        </div>
                        <h3>{remoteCallData?.callerName || companionName} is calling...</h3>
                        <div className="incoming-actions">
                            <button className="decline-btn" onClick={declineCall}>
                                <PhoneOff size={20} />
                                Decline
                            </button>
                            <button className="answer-btn" onClick={answerCall}>
                                <Phone size={20} />
                                Answer
                            </button>
                        </div>
                    </div>
                )}

                {callState === 'connected' && (
                    <div className="call-connected dark:bg-slate-950">
                        <div className="video-grid">
                            <div className="remote-video-container dark:bg-slate-900">
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="remote-video"
                                />
                                <span className="video-label">{companionName || 'Companion'}</span>
                            </div>
                            <div className="local-video-container dark:bg-slate-900">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="local-video"
                                />
                                <span className="video-label">You</span>
                            </div>
                        </div>

                        <div className="call-info">
                            <Clock size={14} />
                            <span>{formatDuration(callDuration)}</span>
                            {callDuration >= 300 && (
                                <span className="time-reminder">5+ minutes</span>
                            )}
                        </div>

                        <div className="call-controls dark:bg-slate-800/80">
                            <button
                                className={`control-btn ${isMuted ? 'active' : ''} dark:bg-slate-700 dark:text-slate-200`}
                                onClick={toggleMute}
                            >
                                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                            <button
                                className={`control-btn ${isVideoOff ? 'active' : ''} dark:bg-slate-700 dark:text-slate-200`}
                                onClick={toggleVideo}
                            >
                                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                            </button>
                            <button className="end-call-btn" onClick={hangUp}>
                                <PhoneOff size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCall;
