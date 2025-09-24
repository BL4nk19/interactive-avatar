/**
 * Avatar system types and interfaces
 */

export type AvatarState = 'idle' | 'active' | 'defensive' | 'thinking';

export type GestureType = 
	| 'Thumb_Up'
	| 'Thumb_Down' 
	| 'Closed_Fist'
	| 'Open_Palm'
	| 'Pointing_Up'
	| 'Victory'
	| 'OK'
	| 'ILoveYou'
	| 'None';

export type AvatarMood = 'happy' | 'neutral' | 'sad' | 'excited' | 'defensive' | 'bored';

export interface AvatarConfig {
	state: AvatarState;
	mood: AvatarMood;
	animationDuration: number;
	scale: number;
	rotation: number;
}

export interface GestureResponse {
	state: AvatarState;
	mood: AvatarMood;
	animation: string;
	duration: number;
	message: string;
}

export interface AvatarProps {
	gestureType: GestureType;
	isPersonDetected: boolean;
	className?: string;
}

export interface AnimationVariants {
	[key: string]: {
		[key: string]: any;
	};
}
