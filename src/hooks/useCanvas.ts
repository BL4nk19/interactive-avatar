import { DrawingUtils, GestureRecognizer, type NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEffectOnce } from "./useEffectOnce";

export default function useCanvas(landmarksArray?: NormalizedLandmark[][]) {
	const [drawingUtils, setDrawingUtils] = useState<DrawingUtils>();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const initializeDrawingUtils = async () => {
		if (!canvasRef.current) return;
		const canvasContext = canvasRef.current.getContext("2d");

		if (!canvasContext) {
			throw new Error("Canvas context not found.");
		}
		setDrawingUtils(new DrawingUtils(canvasContext));
	};

	useEffectOnce(initializeDrawingUtils);

	const draw = useCallback(
		(landmarks: NormalizedLandmark[][]) => {
			if (!canvasRef.current || !drawingUtils) return;
			const canvasContext = canvasRef.current.getContext("2d");
			if (!canvasContext) {
				throw new Error("Canvas context not found.");
			}

			// Clear the canvas
			canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

			// Draw landmarks if they exist
			if (landmarks && landmarks.length > 0) {
				console.log("Drawing landmarks:", landmarks.length, "hands detected");
				for (const landmark of landmarks) {
					if (landmark && landmark.length > 0) {
						// Draw hand connections with increased line width
						drawingUtils.drawConnectors(landmark, GestureRecognizer.HAND_CONNECTIONS, {
							color: "#12B886",
							lineWidth: 3, // Increased from 2
						});
						// Draw landmarks with larger radius
						drawingUtils.drawLandmarks(landmark, {
							color: "#12B886",
							radius: 5, // Increased from 4
						});
						// Draw landmarks with smaller radius for detail
						drawingUtils.drawLandmarks(landmark, {
							color: "#94D82D",
							radius: 3, // Increased from 2
						});
					}
				}
			} else {
				console.log("No landmarks to draw");
			}
		},
		[drawingUtils],
	);

	useEffect(() => {
		if (landmarksArray) {
			draw(landmarksArray);
		}
	}, [draw, landmarksArray]);

	return { landmarksArray, canvasRef };
}
