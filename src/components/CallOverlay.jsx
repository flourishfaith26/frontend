import React, { useEffect, useRef, useState } from 'react';
import { styled, keyframes } from '../stitches.config.js';
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff, UserPlus, X } from 'lucide-react';

const OverlayContainer = styled('div', {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    overflow: 'hidden',
});

const BackgroundBlur = styled('div', {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '120%',
    height: '120%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(80px) brightness(0.35)',
    zIndex: -1,
    transform: 'scale(1.1)',
});

const VideoGrid = styled('div', {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1200px',
    padding: '40px 20px 140px',
    height: '100%',
    alignItems: 'center',
});

const VideoWrapper = styled('div', {
    position: 'relative',
    width: '45%',
    minWidth: '320px',
    aspectRatio: '16/9',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
    '@media (max-width: 768px)': {
        width: '100%',
        aspectRatio: '4/3',
    },
    variants: {
        isLocal: {
            true: {
                border: '1px solid rgba(6, 182, 212, 0.5)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }
        }
    }
});

const VideoElement = styled('video', {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // Mirror local video mostly
});

const CallerInfo = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '80px',
    zIndex: 10,
});

const CallerNameText = styled('h2', {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '32px 0 8px 0',
    textShadow: '0 4px 20px rgba(0,0,0,0.6)',
    letterSpacing: '0.5px',
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
});

const CallStatusText = styled('p', {
    fontSize: '1.1rem',
    color: '#94A3B8',
    margin: 0,
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
});

const Avatar = styled('img', {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: '4px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
    objectFit: 'cover',
    zIndex: 2,
    position: 'relative',
    backgroundColor: '#0F172A',
});

const pulseAnimation = keyframes({
    '0%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.6), 0 0 0 0 rgba(6, 182, 212, 0.4)' },
    '50%': { boxShadow: '0 0 0 30px rgba(6, 182, 212, 0), 0 0 0 60px rgba(6, 182, 212, 0.1)' },
    '100%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0), 0 0 0 0 rgba(6, 182, 212, 0)' },
});

const CallingAnimation = styled('div', {
    position: 'relative',
    animation: `${pulseAnimation} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
        zIndex: 1,
    }
});

const ControlsBar = styled('div', {
    position: 'absolute',
    bottom: '50px',
    display: 'flex',
    gap: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '20px 32px',
    borderRadius: '40px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    zIndex: 100,
});

const ControlButton = styled('button', {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#fff',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    variants: {
        color: {
            danger: { 
                backgroundColor: '#EF4444',
                color: '#fff',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                '&:hover': { 
                    transform: 'translateY(-4px) scale(1.05)',
                    backgroundColor: '#DC2626',
                    boxShadow: '0 15px 30px rgba(239, 68, 68, 0.5)',
                } 
            },
            success: { 
                backgroundColor: '#10B981',
                color: '#fff',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                '&:hover': { 
                    transform: 'translateY(-4px) scale(1.05)',
                    backgroundColor: '#059669',
                    boxShadow: '0 15px 30px rgba(16, 185, 129, 0.5)',
                } 
            },
            neutral: { 
                color: '#E2E8F0',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    transform: 'translateY(-4px)',
                } 
            },
            active: { 
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                color: '#06B6D4',
                border: '1px solid rgba(6, 182, 212, 0.5)',
                boxShadow: '0 10px 25px rgba(6, 182, 212, 0.2)',
                '&:hover': { 
                    backgroundColor: 'rgba(6, 182, 212, 0.3)',
                    transform: 'translateY(-4px)',
                } 
            }
        },
        pulsing: {
            true: {
                animation: `${pulseAnimation} 2s infinite`,
            }
        }
    },
    defaultVariants: {
        color: 'neutral'
    }
});

const CallOverlay = ({
    socket,
    mongoUserId,
    activeConversation,
    callConfig, // { active: bool, isReceiving: bool, callerData: obj, callType: 'video' | 'audio' }
    onEndCall,
    currentUserData
}) => {
    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const callAcceptedRef = useRef(false);
    
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(callConfig?.callType === 'audio');

    const myVideo = useRef();
    const remoteVideo = useRef();
    const connectionRef = useRef();

    const [isAddingPerson, setIsAddingPerson] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);
    const ringTimeoutRef = useRef(null);

    useEffect(() => {
        if (toastMsg) {
            const t = setTimeout(() => setToastMsg(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toastMsg]);

        useEffect(() => {
        if (!callConfig || !callConfig.active) return;

        // Initialize user media
        const initMedia = async () => {
            try {
                if (!navigator.mediaDevices) throw new Error("MediaDevices not supported (HTTPS required on mobile).");
                const currentStream = await navigator.mediaDevices.getUserMedia({ 
                    video: callConfig.callType === 'video', 
                    audio: true 
                });
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                if (!callConfig.isReceiving) {
                    // We are initiating the call
                    initiateCall(currentStream);
                    
                    // Start 30-second ring timeout
                    ringTimeoutRef.current = setTimeout(() => {
                        if (!callAcceptedRef.current) {
                            handleEndCall(true);
                        }
                    }, 30000);
                }
            } catch (err) {
                console.error("Failed to get local stream", err);
                if (!callConfig.isReceiving) {
                    alert("Could not access camera/microphone");
                    handleEndCall();
                }
            }
        };

        if (!callConfig.isReceiving) {
            initMedia();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (connectionRef.current) {
                connectionRef.current.close();
            }
            if (ringTimeoutRef.current) {
                clearTimeout(ringTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callConfig?.active]);

    // Setup Socket Listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('call_accepted', async (signal) => {
            setCallAccepted(true);
            callAcceptedRef.current = true;
            if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
            
            if (connectionRef.current) {
                await connectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            }
        });

        socket.on('webrtc_ice_candidate', async (candidate) => {
            try {
                if (connectionRef.current && connectionRef.current.remoteDescription) {
                    await connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        socket.on('call_ended', () => {
            handleEndCall(false);
        });

        socket.on('call_rejected', () => {
            if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
            handleEndCall(false);
        });

        return () => {
            socket.off('call_accepted');
            socket.off('webrtc_ice_candidate');
            socket.off('call_ended');
            socket.off('call_rejected');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, stream]);

    const createPeerConnection = (userIdToCommunicateWith, localStream = stream) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('webrtc_ice_candidate', {
                    to: userIdToCommunicateWith,
                    candidate: event.candidate
                });
            }
        };

        peerConnection.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = event.streams[0];
            }
        };

                if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }

        return peerConnection;
    };

    const initiateCall = async (currentStream) => {
        if (!activeConversation) return;
        
        // Find other participant id
        const otherParticipant = activeConversation.participants.find(p => p._id !== mongoUserId);
        if (!otherParticipant) {
            alert("No one to call in this conversation");
            handleEndCall();
            return;
        }

        const peerConnection = createPeerConnection(otherParticipant._id);
        connectionRef.current = peerConnection;

        // Add local tracks right away since we just got the stream
        currentStream.getTracks().forEach(track => {
            // Check if sender already exists
            const senders = peerConnection.getSenders();
            const senderExists = senders.find(s => s.track && s.track.kind === track.kind);
            if (!senderExists) {
                peerConnection.addTrack(track, currentStream);
            }
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit('call_user', {
            userToCall: otherParticipant._id,
            signalData: offer,
            from: mongoUserId,
            callerInfo: {
                name: currentUserData?.displayName || 'Someone',
            },
            callType: callConfig.callType
        });
    };

        const answerCall = async () => {
        let currentStream = stream;
        if (!currentStream) {
            try {
                if (!navigator.mediaDevices) throw new Error("MediaDevices not supported (HTTPS required on mobile).");
                currentStream = await navigator.mediaDevices.getUserMedia({ 
                    video: callConfig.callType === 'video', 
                    audio: true 
                });
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            } catch (err) {
                console.error("Failed to get local stream", err);
                alert("Could not access camera/microphone. Please ensure you are using HTTPS or localhost.");
                handleEndCall();
                return;
            }
        }

        setCallAccepted(true);
        callAcceptedRef.current = true;

        const peerConnection = createPeerConnection(callConfig.callerData.from, currentStream);
        connectionRef.current = peerConnection;

        await peerConnection.setRemoteDescription(new RTCSessionDescription(callConfig.callerData.signal));
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit('answer_call', {
            to: callConfig.callerData.from,
            signal: answer
        });
    };

    const handleEndCall = (emitEvent = true) => {
        // Emit log_call only if we are the caller
        if (socket && callConfig && !callConfig.isReceiving) {
            const isGroup = activeConversation?.type === 'group';
            const otherUserId = isGroup ? null : activeConversation?.participants?.find(p => p._id !== mongoUserId)?._id;
            
            socket.emit('log_call', {
                callerId: mongoUserId,
                receiverId: otherUserId,
                conversationId: isGroup ? activeConversation._id : undefined,
                type: callConfig.callType,
                status: callAcceptedRef.current ? 'completed' : 'missed'
            });
        }

        if (emitEvent && socket && callConfig) {
            const otherUserId = callConfig.isReceiving 
                ? callConfig.callerData.from 
                : activeConversation?.participants.find(p => p._id !== mongoUserId)?._id;
                
            if (otherUserId) {
                if (!callAcceptedRef.current && callConfig.isReceiving) {
                    socket.emit('reject_call', { to: otherUserId });
                } else {
                    socket.emit('end_call', { to: otherUserId });
                }
            }
        }
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (connectionRef.current) {
            connectionRef.current.close();
        }
        onEndCall();
    };

    const toggleMute = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    if (!callConfig || !callConfig.active) return null;

    const callerName = callConfig.isReceiving ? callConfig.callerData?.callerInfo?.name || 'Someone' : activeConversation?.participants?.find(p => p._id !== mongoUserId)?.displayName || 'Contact';
    const callerAvatar = activeConversation?.participants?.find(p => p._id !== mongoUserId)?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(callerName)}&background=06B6D4&color=fff`;

    const handleImageError = (e) => {
        // Prevent infinite loop if ui-avatars fails
        e.target.onerror = null; 
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(callerName)}&background=06B6D4&color=fff`;
    };

    return (
        <OverlayContainer>
            <BackgroundBlur style={{ backgroundImage: `url(${callerAvatar})` }} />
            {!callAccepted ? (
                <CallerInfo>
                    <CallingAnimation>
                        <Avatar src={callerAvatar} alt="Caller Avatar" onError={handleImageError} />
                    </CallingAnimation>
                    <CallerNameText>{callConfig.isReceiving ? `${callerName} is calling...` : `Calling ${callerName}...`}</CallerNameText>
                    <CallStatusText>{callConfig.callType === 'video' ? 'Video Call' : 'Voice Call'}</CallStatusText>
                    
                    {callConfig.isReceiving && (
                        <div style={{ display: 'flex', gap: '30px', marginTop: '40px' }}>
                            <ControlButton color="danger" onClick={() => handleEndCall(true)}>
                                <PhoneOff size={28} />
                            </ControlButton>
                            <ControlButton color="success" pulsing={true} onClick={answerCall}>
                                <Phone size={28} />
                            </ControlButton>
                        </div>
                    )}
                </CallerInfo>
            ) : callConfig.callType === 'audio' ? (
                <CallerInfo>
                    <CallingAnimation>
                        <Avatar src={callerAvatar} alt="Caller Avatar" onError={handleImageError} style={{ border: '4px solid #10B981' }} />
                    </CallingAnimation>
                    <CallerNameText>{callerName}</CallerNameText>
                    <CallStatusText style={{ color: '#10B981', textShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}>Connected</CallStatusText>
                    {/* Keep the invisible video elements so WebRTC still works */}
                    <VideoElement playsInline muted ref={myVideo} autoPlay style={{ display: 'none' }} />
                    <VideoElement playsInline ref={remoteVideo} autoPlay style={{ display: 'none' }} />
                </CallerInfo>
            ) : (
                <VideoGrid>
                    {/* Local Video */}
                    <VideoWrapper isLocal={true}>
                        <VideoElement 
                            playsInline 
                            muted 
                            ref={myVideo} 
                            autoPlay 
                            style={{ display: isVideoOff ? 'none' : 'block' }}
                        />
                        {isVideoOff && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar src={`https://ui-avatars.com/api/?name=You&background=06B6D4&color=fff`} alt="Me" style={{ width: 80, height: 80, border: 'none' }} onError={handleImageError} />
                                <span>You</span>
                            </div>
                        )}
                    </VideoWrapper>

                    {/* Remote Video */}
                    <VideoWrapper>
                        <VideoElement 
                            playsInline 
                            ref={remoteVideo} 
                            autoPlay 
                            style={{ transform: 'none' }}
                        />
                        {!remoteStream && (
                            <div style={{ color: '#94A3B8' }}>Connecting...</div>
                        )}
                        {remoteStream && remoteStream.getVideoTracks().length === 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar src={callerAvatar} alt={callerName} style={{ width: 80, height: 80, border: 'none' }} onError={handleImageError} />
                                <span>{callerName}</span>
                            </div>
                        )}
                    </VideoWrapper>
                </VideoGrid>
            )}

            {/* In-Call Controls */}
            {(!callConfig.isReceiving || callAccepted) && (
                <ControlsBar>
                    <ControlButton 
                        color={isMuted ? 'danger' : 'neutral'} 
                        onClick={toggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </ControlButton>
                    
                    <ControlButton 
                        color={isVideoOff ? 'danger' : 'neutral'} 
                        onClick={toggleVideo}
                        title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                    >
                        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </ControlButton>
                    
                    <ControlButton 
                        color="neutral" 
                        onClick={() => setIsAddingPerson(true)}
                        title="Add Person"
                    >
                        <UserPlus size={20} />
                    </ControlButton>
                    
                    <ControlButton color="danger" onClick={() => handleEndCall(true)} title="End Call">
                        <PhoneOff size={20} />
                    </ControlButton>
                </ControlsBar>
            )}

            {/* Add Person Modal */}
            {isAddingPerson && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' }}>
                    <div style={{ width: '90%', maxWidth: '400px', backgroundColor: 'rgba(30, 41, 59, 0.95)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Add to Call</h3>
                            <button onClick={() => setIsAddingPerson(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                            {activeConversation?.participants?.filter(p => p._id !== mongoUserId).map(p => (
                                <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={p.avatarUrl} alt={p.displayName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.displayName || 'U')}&background=06B6D4&color=fff` }} />
                                        <span style={{ fontWeight: '500' }}>{p.displayName}</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setToastMsg(`Ringing ${p.displayName}...`);
                                            setTimeout(() => setIsAddingPerson(false), 500);
                                        }}
                                        style={{ backgroundColor: '#06B6D4', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                            {(!activeConversation?.participants || activeConversation.participants.length <= 2) && (
                                <div style={{ color: '#94A3B8', textAlign: 'center', padding: '20px' }}>
                                    No other participants to add. Group calls coming soon!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast for Add Person */}
            {toastMsg && (
                <div style={{ position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#06B6D4', color: '#fff', padding: '12px 24px', borderRadius: '30px', fontWeight: '500', boxShadow: '0 10px 25px rgba(6, 182, 212, 0.4)', zIndex: 10001, animation: 'slideDown 0.3s ease-out' }}>
                    {toastMsg}
                </div>
            )}
        </OverlayContainer>
    );
};

export default CallOverlay;
