import type { GestureType, GestureResponse } from '../../types/avatar';

/**
 * Avatar state management and gesture response mapping
 */

export const GESTURE_RESPONSES: Record<GestureType, GestureResponse> = {
	Thumb_Up: {
		state: 'active',
		mood: 'happy',
		animation: 'thumbsUp',
		duration: 2000,
		message: 'Great job! 👍'
	},
	Thumb_Down: {
		state: 'defensive',
		mood: 'sad',
		animation: 'thumbsDown',
		duration: 1500,
		message: 'Oh no... 😔'
	},
	Closed_Fist: {
		state: 'defensive',
		mood: 'defensive',
		animation: 'defensive',
		duration: 2000,
		message: 'I sense aggression... 🛡️'
	},
	Open_Palm: {
		state: 'active',
		mood: 'excited',
		animation: 'wave',
		duration: 2500,
		message: 'Hello there! 👋'
	},
	Pointing_Up: {
		state: 'active',
		mood: 'excited',
		animation: 'hearts',
		duration: 3000,
		message: 'We love you Andre! 💕💕💕'
	},
	Victory: {
		state: 'active',
		mood: 'excited',
		animation: 'victory',
		duration: 2200,
		message: 'Victory! ✌️'
	},
	OK: {
		state: 'active',
		mood: 'excited',
		animation: 'hearts',
		duration: 3000,
		message: 'We love you Andre! 💕💕💕'
	},
	ILoveYou: {
		state: 'active',
		mood: 'excited',
		animation: 'hearts',
		duration: 3000,
		message: 'I love you too! 🤟💕'
	},
	None: {
		state: 'idle',
		mood: 'bored',
		animation: 'idle',
		duration: 1000,
		message: 'Show me a gesture! 👋'
	}
};

export const IDLE_ANIMATIONS = [
	'idle',
	'lookAround',
	'yawn',
	'stretch',
	'blink'
] as const;

export const DEFENSIVE_ANIMATIONS = [
	'defensive',
	'shield',
	'backAway',
	'concerned'
] as const;

export const ACTIVE_ANIMATIONS = [
	'wave',
	'thumbsUp',
	'victory',
	'pointAcknowledge',
	'excited',
	'hearts'
] as const;

/**
 * Get avatar response based on gesture and person detection
 */
export function getAvatarResponse(
	gestureType: GestureType,
	isPersonDetected: boolean
): GestureResponse {
	if (!isPersonDetected) {
		return {
			state: 'idle',
			mood: 'bored',
			animation: 'lookAround',
			duration: 3000,
			message: 'Looking for someone to interact with...'
		};
	}

	return GESTURE_RESPONSES[gestureType];
}

/**
 * Get random idle animation for variety
 */
export function getRandomIdleAnimation(): string {
	const animations = IDLE_ANIMATIONS;
	return animations[Math.floor(Math.random() * animations.length)];
}

/**
 * Check if gesture is positive/friendly
 */
export function isPositiveGesture(gestureType: GestureType): boolean {
	const positiveGestures: GestureType[] = ['Thumb_Up', 'Open_Palm', 'Pointing_Up', 'Victory', 'ILoveYou'];
	return positiveGestures.includes(gestureType);
}

/**
 * Check if gesture is negative/aggressive
 */
export function isNegativeGesture(gestureType: GestureType): boolean {
	const negativeGestures: GestureType[] = ['Thumb_Down', 'Closed_Fist'];
	return negativeGestures.includes(gestureType);
}
