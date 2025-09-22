import type { AnimationVariants } from '../../types/avatar';

/**
 * Avatar animation variants using Framer Motion
 */

export const avatarVariants: AnimationVariants = {
	// Base idle animations
	idle: {
		scale: [1, 1.05, 1],
		rotate: [0, 2, -2, 0],
		transition: {
			duration: 2,
			repeat: Infinity,
			repeatType: 'reverse',
			ease: 'easeInOut'
		}
	},

	// Look around when no person detected
	lookAround: {
		rotate: [0, 15, -15, 10, -10, 0],
		scale: [1, 1.1, 1],
		transition: {
			duration: 3,
			ease: 'easeInOut'
		}
	},

	// Yawn animation
	yawn: {
		scale: [1, 1.2, 1],
		rotate: [0, 5, -5, 0],
		transition: {
			duration: 2,
			ease: 'easeInOut'
		}
	},

	// Stretch animation
	stretch: {
		scale: [1, 1.15, 1],
		rotate: [0, 8, -8, 0],
		transition: {
			duration: 2.5,
			ease: 'easeInOut'
		}
	},

	// Blink animation
	blink: {
		scale: [1, 1, 0.8, 1],
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	},

	// Active gesture responses
	wave: {
		rotate: [0, 20, -20, 15, -15, 0],
		scale: [1, 1.2, 1.1, 1],
		transition: {
			duration: 2.5,
			ease: 'easeInOut'
		}
	},

	thumbsUp: {
		scale: [1, 1.3, 1.1, 1],
		rotate: [0, 10, -5, 0],
		transition: {
			duration: 2,
			ease: 'easeInOut'
		}
	},

	thumbsDown: {
		scale: [1, 0.9, 1],
		rotate: [0, -10, 5, 0],
		transition: {
			duration: 1.5,
			ease: 'easeInOut'
		}
	},

	victory: {
		scale: [1, 1.25, 1.1, 1],
		rotate: [0, 15, -10, 5, 0],
		transition: {
			duration: 2.2,
			ease: 'easeInOut'
		}
	},

	pointAcknowledge: {
		scale: [1, 1.15, 1],
		rotate: [0, 12, -8, 0],
		transition: {
			duration: 1.8,
			ease: 'easeInOut'
		}
	},

	excited: {
		scale: [1, 1.2, 1.1, 1.2, 1],
		rotate: [0, 5, -5, 3, -3, 0],
		transition: {
			duration: 1.5,
			ease: 'easeInOut'
		}
	},

	// Defensive animations
	defensive: {
		scale: [1, 0.95, 1],
		rotate: [0, -15, 10, -5, 0],
		transition: {
			duration: 2,
			ease: 'easeInOut'
		}
	},

	shield: {
		scale: [1, 1.1, 0.9, 1],
		rotate: [0, -20, 15, -10, 0],
		transition: {
			duration: 2.5,
			ease: 'easeInOut'
		}
	},

	backAway: {
		scale: [1, 0.8, 0.9, 1],
		rotate: [0, -25, 20, -15, 0],
		transition: {
			duration: 2,
			ease: 'easeInOut'
		}
	},

	concerned: {
		scale: [1, 0.9, 1],
		rotate: [0, -8, 5, -3, 0],
		transition: {
			duration: 1.8,
			ease: 'easeInOut'
		}
	}
};

/**
 * Mood-based color variants
 */
export const moodColors = {
	happy: 'text-green-500',
	neutral: 'text-blue-500',
	sad: 'text-gray-500',
	excited: 'text-yellow-500',
	defensive: 'text-red-500',
	bored: 'text-gray-400'
};

/**
 * State-based background variants
 */
export const stateBackgrounds = {
	idle: 'bg-gradient-to-br from-blue-100 to-blue-200',
	active: 'bg-gradient-to-br from-green-100 to-green-200',
	defensive: 'bg-gradient-to-br from-red-100 to-red-200',
	thinking: 'bg-gradient-to-br from-purple-100 to-purple-200'
};

/**
 * Get animation variant by name
 */
export function getAnimationVariant(animationName: string) {
	return avatarVariants[animationName] || avatarVariants.idle;
}

/**
 * Get mood color class
 */
export function getMoodColor(mood: string) {
	return moodColors[mood as keyof typeof moodColors] || moodColors.neutral;
}

/**
 * Get state background class
 */
export function getStateBackground(state: string) {
	return stateBackgrounds[state as keyof typeof stateBackgrounds] || stateBackgrounds.idle;
}
