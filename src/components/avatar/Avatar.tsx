import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { AvatarProps, AvatarState, AvatarMood } from '../../types/avatar';
import { getAvatarResponse, getRandomIdleAnimation } from './AvatarStates';
import { 
	getAnimationVariant, 
	getMoodColor, 
	getStateBackground 
} from './AvatarAnimations';

/**
 * Interactive Avatar Component
 * Responds to MediaPipe gesture detection with animations and state changes
 */
export default function Avatar({ gestureType, isPersonDetected, className = '' }: AvatarProps) {
	const [currentAnimation, setCurrentAnimation] = useState('idle');
	const [currentMessage, setCurrentMessage] = useState('Hello! I\'m your interactive avatar 👋');
	const [isAnimating, setIsAnimating] = useState(false);

	// Get avatar response based on gesture and person detection
	const response = getAvatarResponse(gestureType, isPersonDetected);

	// Update animation when gesture changes
	useEffect(() => {
		if (isAnimating) return; // Prevent animation interruption

		setIsAnimating(true);
		setCurrentAnimation(response.animation);
		setCurrentMessage(response.message);

		// Reset animation state after duration
		const timer = setTimeout(() => {
			setIsAnimating(false);
			// If no person detected, cycle through idle animations
			if (!isPersonDetected) {
				const randomIdle = getRandomIdleAnimation();
				setCurrentAnimation(randomIdle);
			}
		}, response.duration);

		return () => clearTimeout(timer);
	}, [gestureType, isPersonDetected, response, isAnimating]);

	// Get current state and mood
	const currentState: AvatarState = response.state;
	const currentMood: AvatarMood = response.mood;

	return (
		<div className={`flex flex-col items-center justify-center p-8 ${className}`}>
			{/* Avatar Character */}
			<motion.div
				className={`
					relative w-32 h-32 rounded-full flex items-center justify-center text-6xl
					${getStateBackground(currentState)}
					shadow-lg border-4 border-white
					transition-all duration-300
				`}
				variants={getAnimationVariant(currentAnimation)}
				animate={currentAnimation}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				{/* Avatar Face/Character */}
				<AnimatePresence mode="wait">
					<motion.div
						key={`${currentState}-${currentMood}`}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3 }}
						className={`${getMoodColor(currentMood)}`}
					>
						{getAvatarEmoji(currentState, currentMood)}
					</motion.div>
				</AnimatePresence>

				{/* Status Indicator */}
				<motion.div
					className={`
						absolute -top-2 -right-2 w-6 h-6 rounded-full
						${getStatusIndicatorColor(currentState)}
						border-2 border-white
					`}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.7, 1, 0.7]
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
				/>
			</motion.div>

			{/* Avatar Message */}
			<motion.div
				className="mt-6 text-center max-w-xs"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<motion.p
					key={currentMessage}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3 }}
					className={`
						text-lg font-medium px-4 py-2 rounded-lg
						${getMoodColor(currentMood)}
						bg-white/80 backdrop-blur-sm
						shadow-md
					`}
				>
					{currentMessage}
				</motion.p>

				{/* Gesture Status */}
				<motion.div
					className="mt-2 text-sm text-gray-600"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					{isPersonDetected ? (
						<span className="text-green-600">👤 Person detected</span>
					) : (
						<span className="text-gray-500">🔍 Looking for gestures...</span>
					)}
				</motion.div>
			</motion.div>

			{/* Animation Debug Info (only in development) */}
			{process.env.NODE_ENV === 'development' && (
				<motion.div
					className="mt-4 text-xs text-gray-400 bg-gray-100 px-3 py-2 rounded"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7 }}
				>
					<div>State: {currentState}</div>
					<div>Mood: {currentMood}</div>
					<div>Animation: {currentAnimation}</div>
					<div>Gesture: {gestureType}</div>
				</motion.div>
			)}
		</div>
	);
}

/**
 * Get avatar emoji based on state and mood
 */
function getAvatarEmoji(state: AvatarState, mood: AvatarMood): string {
	const emojiMap = {
		idle: {
			happy: '😊',
			neutral: '😐',
			sad: '😔',
			excited: '🤩',
			defensive: '😠',
			bored: '😴'
		},
		active: {
			happy: '😄',
			neutral: '🙂',
			sad: '😢',
			excited: '🤗',
			defensive: '😤',
			bored: '😑'
		},
		defensive: {
			happy: '😅',
			neutral: '😐',
			sad: '😰',
			excited: '😳',
			defensive: '😡',
			bored: '😒'
		},
		thinking: {
			happy: '🤔',
			neutral: '🤔',
			sad: '😔',
			excited: '🤯',
			defensive: '😠',
			bored: '😑'
		}
	};

	return emojiMap[state]?.[mood] || '🤖';
}

/**
 * Get status indicator color based on state
 */
function getStatusIndicatorColor(state: AvatarState): string {
	const colors = {
		idle: 'bg-blue-400',
		active: 'bg-green-400',
		defensive: 'bg-red-400',
		thinking: 'bg-purple-400'
	};

	return colors[state] || 'bg-gray-400';
}
