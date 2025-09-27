import { useEffect, useRef, useState } from 'react';
import type { GestureType } from '../../types/avatar';

export interface VideoAvatarProps {
	gestureType: GestureType;
	isPersonDetected: boolean;
	className?: string;
}

interface VideoState {
	currentVideo: string;
	previousVideo: string;
	isTransitioning: boolean;
}

/**
 * Video Avatar Component
 * Displays smooth video transitions based on gesture detection
 * Uses multiple video elements with CSS crossfade for seamless transitions
 */
export default function VideoAvatar({ 
	gestureType, 
	isPersonDetected, 
	className = '' 
}: VideoAvatarProps) {
	const [videoState, setVideoState] = useState<VideoState>({
		currentVideo: 'idle',
		previousVideo: 'idle',
		isTransitioning: false
	});

	const idleVideoRef = useRef<HTMLVideoElement>(null);
	const waveVideoRef = useRef<HTMLVideoElement>(null);
	const peaceVideoRef = useRef<HTMLVideoElement>(null);
	const defensiveVideoRef = useRef<HTMLVideoElement>(null);
	const loveYouVideoRef = useRef<HTMLVideoElement>(null);
	const thumbsUpVideoRef = useRef<HTMLVideoElement>(null);
	const transitionTimeoutRef = useRef<NodeJS.Timeout>();

	// Video mapping configuration
	const gestureToVideo: Record<GestureType, string> = {
		'None': 'idle',
		'Thumb_Up': 'thumbs-up', // Updated: Thumb_Up now has its own video
		'Thumb_Down': 'defensive',
		'Closed_Fist': 'defensive',
		'Open_Palm': 'wave',
		'Pointing_Up': 'love-you',
		'Victory': 'peace',
		'OK': 'wave',
		'ILoveYou': 'love-you'
	};

	// Get target video based on gesture and person detection
	const getTargetVideo = (): string => {
		if (!isPersonDetected) {
			return 'idle';
		}
		return gestureToVideo[gestureType] || 'idle';
	};

	// Handle video transitions
	const transitionToVideo = (targetVideo: string) => {
		if (targetVideo === videoState.currentVideo && !videoState.isTransitioning) {
			return;
		}

		setVideoState(prev => ({
			previousVideo: prev.currentVideo,
			currentVideo: targetVideo,
			isTransitioning: true
		}));

		// Start transition
		setTimeout(() => {
			playVideo(targetVideo);
		}, 100);

		// Complete transition after crossfade duration
		clearTimeout(transitionTimeoutRef.current);
		transitionTimeoutRef.current = setTimeout(() => {
			setVideoState(prev => ({
				...prev,
				isTransitioning: false
			}));
		}, 500);
	};

	// Play specific video
	const playVideo = (videoType: string) => {
		// Get the target video ref
		const getVideoRef = (type: string) => {
			switch (type) {
				case 'idle': return idleVideoRef;
				case 'wave': return waveVideoRef;
				case 'peace': return peaceVideoRef;
				case 'defensive': return defensiveVideoRef;
				case 'love-you': return loveYouVideoRef;
				case 'thumbs-up': return thumbsUpVideoRef;
				default: return idleVideoRef;
			}
		};

		const videoRef = getVideoRef(videoType);
		const video = videoRef.current;
		
		// Pause all other videos
		const allVideoRefs = [idleVideoRef, waveVideoRef, peaceVideoRef, defensiveVideoRef, loveYouVideoRef, thumbsUpVideoRef];
		allVideoRefs.forEach(ref => {
			if (ref !== videoRef && ref.current && !ref.current.paused) {
				ref.current.pause();
			}
		});
		
		// Play target video
		if (video) {
			// Reset to beginning and play - the loop attribute will handle continuous playback
			video.currentTime = 0;
			video.loop = true; // Ensure looping is enabled
			video.play().catch((error) => {
				console.error(`VideoAvatar: Failed to play ${videoType} video:`, error);
			});
		}
	};

	// Effect to handle gesture-based video changes
	useEffect(() => {
		const targetVideo = getTargetVideo();
		transitionToVideo(targetVideo);
		
		// Videos will loop continuously while gesture is detected
		// Only return to idle when gesture becomes 'None' or person is not detected
	}, [gestureType, isPersonDetected, videoState.currentVideo]);

	// Initialize videos on mount
	useEffect(() => {
		const initializeVideo = (video: HTMLVideoElement | null, shouldPlay: boolean = false) => {
			if (video) {
				video.preload = 'auto';
				video.load();
				
				// Auto-play idle video on mount
				if (shouldPlay) {
					video.play().catch((error) => {
						console.error(`VideoAvatar: Failed to auto-play video:`, error);
					});
				}
			}
		};

		// Start with idle video playing
		initializeVideo(idleVideoRef.current, true);
		initializeVideo(waveVideoRef.current, false);
		initializeVideo(peaceVideoRef.current, false);
		initializeVideo(defensiveVideoRef.current, false);
		initializeVideo(loveYouVideoRef.current, false);
		initializeVideo(thumbsUpVideoRef.current, false);
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			clearTimeout(transitionTimeoutRef.current);
		};
	}, []);

	return (
		<div className={`video-avatar-container ${className}`}>
			{/* Idle Video */}
			<video
				ref={idleVideoRef}
				className="video-avatar-video"
				style={{
					opacity: videoState.currentVideo === 'idle' ? 1 : 0,
					zIndex: videoState.currentVideo === 'idle' ? 2 : 1
				}}
				loop
				muted
				playsInline
				autoPlay
				preload="auto"
			>
				<source src="/react-hand-gesture-recognition/avatars/idle.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Wave Video */}
			<video
				ref={waveVideoRef}
				className="video-avatar-video"
				style={{
					opacity: videoState.currentVideo === 'wave' ? 1 : 0,
					zIndex: videoState.currentVideo === 'wave' ? 2 : 1
				}}
				loop
				muted
				playsInline
				preload="auto"
			>
				<source src="/react-hand-gesture-recognition/avatars/wave.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Peace Video */}
			<video
				ref={peaceVideoRef}
				className="video-avatar-video"
				style={{
					opacity: videoState.currentVideo === 'peace' ? 1 : 0,
					zIndex: videoState.currentVideo === 'peace' ? 2 : 1
				}}
				loop
				muted
				playsInline
				preload="auto"
			>
				<source src="/react-hand-gesture-recognition/avatars/peace.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Defensive Video */}
			<video
				ref={defensiveVideoRef}
				className="video-avatar-video"
				style={{
					opacity: videoState.currentVideo === 'defensive' ? 1 : 0,
					zIndex: videoState.currentVideo === 'defensive' ? 2 : 1
				}}
				loop
				muted
				playsInline
				preload="auto"
			>
				<source src="/react-hand-gesture-recognition/avatars/defensive.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Love You Video */}
			<video
				ref={loveYouVideoRef}
				className="video-avatar-video"
				style={{
					opacity: videoState.currentVideo === 'love-you' ? 1 : 0,
					zIndex: videoState.currentVideo === 'love-you' ? 2 : 1
				}}
				loop
				muted
				playsInline
				preload="auto"
			>
				<source src="/react-hand-gesture-recognition/avatars/love-you.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Thumbs Up Video */}
			<video
				ref={thumbsUpVideoRef}
				className="video-avatar-video"
				style={{
					opacity: videoState.currentVideo === 'thumbs-up' ? 1 : 0,
					zIndex: videoState.currentVideo === 'thumbs-up' ? 2 : 1
				}}
				loop
				muted
				playsInline
				preload="auto"
			>
				<source src="/react-hand-gesture-recognition/avatars/thumbs-up.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Video Status Overlay */}
			<div className="video-avatar-status">
				<div className={`video-avatar-indicator ${
					videoState.currentVideo === 'idle' ? 'idle' : 
					videoState.currentVideo === 'wave' ? 'wave' :
					videoState.currentVideo === 'peace' ? 'wave' :
					videoState.currentVideo === 'defensive' ? 'wave' :
					videoState.currentVideo === 'love-you' ? 'wave' :
					videoState.currentVideo === 'thumbs-up' ? 'wave' : 'idle'
				}`} />
				<span className="capitalize">
					{videoState.currentVideo === 'idle' ? 'Idle' : 
					 videoState.currentVideo === 'wave' ? 'Wave' :
					 videoState.currentVideo === 'peace' ? 'Peace' :
					 videoState.currentVideo === 'defensive' ? 'Defensive' :
					 videoState.currentVideo === 'love-you' ? 'Love You' :
					 videoState.currentVideo === 'thumbs-up' ? 'Thumbs Up' : 'Idle'}
				</span>
			</div>

			{/* Person Detection Indicator */}
			<div className="video-avatar-detection">
				<div className={`video-avatar-indicator ${
					isPersonDetected ? 'person-detected' : 'no-person'
				}`} />
				<span>
					{isPersonDetected ? 'Person Detected' : 'No Person'}
				</span>
			</div>

			{/* Transition Overlay */}
			<div className={`video-avatar-overlay ${
				videoState.isTransitioning ? 'transitioning' : ''
			}`} />
		</div>
	);
}
