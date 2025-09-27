import { useCallback, useEffect, useRef, useState } from 'react';
import type { GestureType } from '../types/avatar';

export interface VideoState {
	currentVideo: string;
	previousVideo: string;
	isTransitioning: boolean;
	transitionProgress: number;
}

export interface VideoTransition {
	from: string;
	to: string;
	duration: number;
	startTime: number;
}

/**
 * Video Avatar Hook
 * Manages gesture-to-video mapping and smooth transitions
 * Provides video state management and transition logic
 */
export default function useVideoAvatar() {
	const [videoState, setVideoState] = useState<VideoState>({
		currentVideo: 'idle',
		previousVideo: 'idle',
		isTransitioning: false,
		transitionProgress: 0
	});

	const [activeTransition, setActiveTransition] = useState<VideoTransition | null>(null);
	const transitionTimeoutRef = useRef<NodeJS.Timeout>();
	const animationFrameRef = useRef<number>();

	// Video mapping configuration
	const gestureToVideo: Record<GestureType, string> = {
		'None': 'idle',
		'Thumb_Up': 'idle',
		'Thumb_Down': 'idle',
		'Closed_Fist': 'idle',
		'Open_Palm': 'wave',
		'Pointing_Up': 'wave',
		'Victory': 'wave',
		'OK': 'wave',
		'ILoveYou': 'wave'
	};

	// Transition timing configuration
	const TRANSITION_CONFIG = {
		crossfadeDuration: 500, // 0.5s crossfade
		gestureResponseDuration: 3000, // 3s gesture response
		transitionEasing: 'ease-in-out'
	};

	/**
	 * Get target video based on gesture and person detection
	 */
	const getTargetVideo = useCallback((gestureType: GestureType, isPersonDetected: boolean): string => {
		if (!isPersonDetected) {
			return 'idle';
		}
		return gestureToVideo[gestureType] || 'idle';
	}, []);

	/**
	 * Start smooth video transition
	 */
	const startTransition = useCallback((targetVideo: string) => {
		if (targetVideo === videoState.currentVideo && !videoState.isTransitioning) {
			return;
		}

		const startTime = Date.now();
		const transition: VideoTransition = {
			from: videoState.currentVideo,
			to: targetVideo,
			duration: TRANSITION_CONFIG.crossfadeDuration,
			startTime
		};

		setActiveTransition(transition);
		setVideoState(prev => ({
			...prev,
			previousVideo: prev.currentVideo,
			currentVideo: targetVideo,
			isTransitioning: true,
			transitionProgress: 0
		}));

		// Animate transition progress
		const animateTransition = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / TRANSITION_CONFIG.crossfadeDuration, 1);
			
			setVideoState(prev => ({
				...prev,
				transitionProgress: progress
			}));

			if (progress < 1) {
				animationFrameRef.current = requestAnimationFrame(animateTransition);
			} else {
				// Transition complete
				setVideoState(prev => ({
					...prev,
					isTransitioning: false,
					transitionProgress: 1
				}));
				setActiveTransition(null);
			}
		};

		animationFrameRef.current = requestAnimationFrame(animateTransition);
	}, [videoState.currentVideo, videoState.isTransitioning]);

	/**
	 * Handle gesture-based video changes
	 */
	const handleGestureChange = useCallback((
		gestureType: GestureType, 
		isPersonDetected: boolean
	) => {
		const targetVideo = getTargetVideo(gestureType, isPersonDetected);
		startTransition(targetVideo);

		// Auto-return to idle after gesture response
		if (targetVideo !== 'idle' && isPersonDetected) {
			clearTimeout(transitionTimeoutRef.current);
			transitionTimeoutRef.current = setTimeout(() => {
				startTransition('idle');
			}, TRANSITION_CONFIG.gestureResponseDuration);
		}
	}, [getTargetVideo, startTransition]);

	/**
	 * Get current video opacity for smooth crossfade
	 */
	const getVideoOpacity = useCallback((videoType: string): number => {
		if (!videoState.isTransitioning) {
			return videoState.currentVideo === videoType ? 1 : 0;
		}

		const progress = videoState.transitionProgress;
		
		if (videoType === videoState.currentVideo) {
			// Fading in
			return Math.min(progress * 2, 1);
		} else if (videoType === videoState.previousVideo) {
			// Fading out
			return Math.max(1 - (progress * 2), 0);
		}
		
		return 0;
	}, [videoState]);

	/**
	 * Get transition CSS classes
	 */
	const getTransitionClasses = useCallback((videoType: string): string => {
		const opacity = getVideoOpacity(videoType);
		return `opacity-${Math.round(opacity * 100)} transition-opacity duration-${TRANSITION_CONFIG.crossfadeDuration} ease-in-out`;
	}, [getVideoOpacity]);

	/**
	 * Check if video should be playing
	 */
	const shouldPlayVideo = useCallback((videoType: string): boolean => {
		return videoState.currentVideo === videoType || 
			   (videoState.isTransitioning && 
				(videoType === videoState.currentVideo || videoType === videoState.previousVideo));
	}, [videoState]);

	/**
	 * Get video status information
	 */
	const getVideoStatus = useCallback(() => {
		return {
			currentVideo: videoState.currentVideo,
			isTransitioning: videoState.isTransitioning,
			transitionProgress: Math.round(videoState.transitionProgress * 100),
			activeTransition: activeTransition
		};
	}, [videoState, activeTransition]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			clearTimeout(transitionTimeoutRef.current);
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return {
		videoState,
		handleGestureChange,
		getVideoOpacity,
		getTransitionClasses,
		shouldPlayVideo,
		getVideoStatus,
		TRANSITION_CONFIG
	};
}
