import { useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useCanvas from "./hooks/useCanvas";
import useRecognizer from "./hooks/useRecognizer";
import Avatar from "./components/avatar/Avatar";
import type { GestureType } from "./types/avatar";

const emojisMap: Record<string, string> = {
	Thumb_Up: "👍",
	Thumb_Down: "👎",
	Closed_Fist: "✊",
	Open_Palm: "🖐️",
	Pointing_Up: "👆",
	Victory: "✌️",
	None: "",
};

function App() {
	const [scope, animate] = useAnimate();
	const [isMediaStreamReady, setIsMediaStreamReady] = useState(false);
	const { videoRef, results, recognizerRef, error } = useRecognizer();
	const { canvasRef } = useCanvas(results?.landmarks);

	const emojiLabel = results?.gestures[0]?.[0].categoryName ?? "None";
	const gestureType: GestureType = emojiLabel as GestureType;
	const isPersonDetected = results?.landmarks && results.landmarks.length > 0;

	// Debug logging
	useEffect(() => {
		console.log("App state:", {
			isMediaStreamReady,
			hasVideoRef: !!videoRef.current,
			hasRecognizer: !!recognizerRef.current,
			hasResults: !!results,
			landmarksCount: results?.landmarks?.length || 0,
			gesturesCount: results?.gestures?.length || 0,
			emojiLabel,
			gestureType,
			isPersonDetected
		});
	}, [isMediaStreamReady, videoRef.current, recognizerRef.current, results, emojiLabel, gestureType, isPersonDetected]);

	const onUserMediaError = (error: string | DOMException) => {
		setIsMediaStreamReady(false);
		console.error("Error getting user media", error);
	};

	useEffect(() => {
		if (emojiLabel !== "None") {
			animate(scope.current, {
				opacity: [0, 1],
				rotate: [180, 0],
				scale: [2, 1],
				transition: { type: "spring", stiffness: 260, damping: 20, duration: 5 },
			});
		}
	}, [emojiLabel, animate, scope.current]);

	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Interactive Avatar Gesture Recognition
					</h1>
					<p className="text-lg text-gray-600">
						Show hand gestures to interact with your AI avatar! 👍 👎 ✊ 🖐️ 👆 ✌️
					</p>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
					{/* Avatar Section */}
					<div className="flex justify-center">
						<Avatar
							gestureType={gestureType}
							isPersonDetected={!!isPersonDetected}
							className="w-full max-w-md"
						/>
					</div>

					{/* Camera Section */}
					<div className="flex flex-col items-center">
						<div className="relative">
							<canvas 
								ref={canvasRef} 
								width={400} 
								height={300}
								className="absolute top-0 left-0 z-10 pointer-events-none"
							/>
							<div
								className={`relative rounded-lg overflow-hidden shadow-lg ${
									isMediaStreamReady ? "videoContainer" : ""
								} ${
									results?.gestures.length ? "active" : "inactive"
								}`}
							>
								<Webcam
									videoConstraints={{ width: 400, height: 300, facingMode: "user" }}
									width={400}
									height={300}
									ref={(webCamRef) => {
										if (webCamRef?.video) {
											videoRef.current = webCamRef.video;
										}
									}}
									audio={false}
									playsInline
									muted
									onUserMedia={() => setIsMediaStreamReady(true)}
									onUserMediaError={onUserMediaError}
									className="w-full h-auto"
								/>
							</div>
						</div>

						{/* Status Information */}
						<div className="mt-6 text-center space-y-2">
							<p className="text-sm text-gray-600">
								{error
									? "🔴 Failed to initiate recognizer. Check your browser console and network."
									: recognizerRef.current === null
										? "🟠 Initiating recognizer..."
										: "🟢 Recognizer ready"}
							</p>
							
							{recognizerRef.current !== null && (
								<p className="text-sm font-medium">
									{emojiLabel === "None" 
										? "No gesture detected 🤷" 
										: `${emojisMap[emojiLabel]} gesture detected`
									}
								</p>
							)}

							{/* Legacy emoji display (keeping for reference) */}
							<div className="mt-4">
								<h2 className="text-2xl font-semibold text-gray-700 mb-2">Detected Gesture:</h2>
								<div 
									className="text-6xl"
									ref={scope}
								>
									{emojisMap[emojiLabel]}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export default App;
