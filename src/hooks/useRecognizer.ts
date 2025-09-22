import type { GestureRecognizerResult } from "@mediapipe/tasks-vision";
import { useRef, useState } from "react";
import Recognizer from "../lib/Recognizer";
import { useEffectOnce } from "./useEffectOnce";

/**
 * A custom React hook for integrating the Recognizer class into React applications.
 * Manages initialization of the Recognizer instance and provides access to inference results.
 * @returns {{
 *   results: GestureRecognizerResult | null,
 *   videoRef: React.MutableRefObject<HTMLVideoElement | undefined>
 * }} An object containing inference results and a reference to the video element.
 */
export default function useRecognizer() {
	const [error, setError] = useState<string>();
	const [results, setResults] = useState<GestureRecognizerResult | null>(null);
	const recognizerRef = useRef<Recognizer | null>(null);
	const videoRef = useRef<HTMLVideoElement>();

	/**
	 * Initializes the Recognizer instance when the video element becomes available.
	 */
	const initializeRecognizer = async () => {
		try {
			// Early return if a Recognizer instance already exists or video element is not available
			if (!videoRef.current || recognizerRef.current) return;

			// Wait for video element to be ready
			const waitForVideo = () => {
				return new Promise<HTMLVideoElement>((resolve) => {
					const checkVideo = () => {
						if (videoRef.current && videoRef.current.readyState >= 2) {
							resolve(videoRef.current);
						} else {
							setTimeout(checkVideo, 100);
						}
					};
					checkVideo();
				});
			};

			const videoElement = await waitForVideo();
			console.log("Video element ready, initializing recognizer...");

			const recognizer = await Recognizer.create({
				videoElement: videoElement,
			});
			recognizerRef.current = recognizer;

			recognizer.onResults((results) => {
				console.log("Gesture recognition results:", results);
				setResults(results);
			});

			console.log("Recognizer initialized successfully");
		} catch (error) {
			console.error("Failed to initialize Recognizer:", error);
			setError("Failed to initialize Recognizer");
			throw new Error("Failed to initialize Recognizer");
		}
	};

	useEffectOnce(initializeRecognizer);

	return { results, videoRef, recognizerRef, error };
}
