import {
	FileTextIcon,
	GlobeIcon,
	InputIcon,
} from "@radix-ui/react-icons";
import { useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useCanvas from "./hooks/useCanvas";
import useRecognizer from "./hooks/useRecognizer";
import Avatar from "./components/avatar/Avatar";
import type { GestureType } from "./types/avatar";


function App() {
	const [scope, animate] = useAnimate();
	const [isMediaStreamReady, setIsMediaStreamReady] = useState(false);
	const { videoRef, results, recognizerRef } = useRecognizer();
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
		<main className="min-h-screen bg-white p-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						BusinessGPT Buddy
					</h1>
					<p className="text-lg text-gray-600">
						v0.1 POC Playground
					</p>
				</div>

				{/* Custom Grid Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[250px]">
					{/* Gesture Camera Card */}
					<div className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3">
						<div className="h-full bg-white rounded-xl border border-gray-200/50 shadow-lg relative overflow-hidden">
							{/* Header */}
							<div className="absolute top-0 left-0 right-0 p-6 pb-2 z-20">
								<div className="flex items-center gap-3 mb-2">
									<InputIcon className="h-6 w-6 text-gray-700" />
									<h3 className="text-lg font-semibold text-gray-900">Gesture Camera</h3>
								</div>
								<p className="text-sm text-gray-600">Webcam feed with hand gesture detection overlay</p>
							</div>
							
							{/* Video Content */}
							<div className="absolute inset-0 pt-16 pb-4 px-6">
								<div className="relative w-full h-full flex items-center justify-center">
									<div
										className={`relative rounded-lg overflow-hidden shadow-lg max-w-full ${
											isMediaStreamReady ? "videoContainer" : ""
										} ${
											results?.gestures.length ? "active" : "inactive"
										}`}
										style={{ aspectRatio: '4/3', maxHeight: 'calc(100% - 4rem)' }}
									>
										<Webcam
											videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
											width={640}
											height={480}
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
											className="w-full h-full object-cover rounded-lg"
										/>
										<canvas 
											ref={canvasRef} 
											width={640} 
											height={480}
											className="absolute top-0 left-0 z-10 pointer-events-none rounded-lg"
											style={{ 
												width: '100%', 
												height: '100%'
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Interactive Avatar Card - Large */}
					<div className="lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4">
						<div className="h-full bg-white rounded-xl border border-gray-200/50 shadow-lg p-6 flex flex-col overflow-hidden">
							<div className="flex items-center gap-3 mb-4">
								<FileTextIcon className="h-6 w-6 text-gray-700" />
								<h3 className="text-lg font-semibold text-gray-900">Interactive Avatar</h3>
							</div>
							<p className="text-sm text-gray-600 mb-6">Your AI avatar responds to hand gestures in real-time</p>
							<div className="flex-1 flex items-center justify-center relative p-4">
								<div className="w-full max-w-sm relative">
									<Avatar
										gestureType={gestureType}
										isPersonDetected={!!isPersonDetected}
										className="w-full h-full"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Gesture Status Card */}
					<div className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4">
						<div className="h-full bg-white rounded-xl border border-gray-200/50 shadow-lg p-6 flex flex-col">
							<div className="flex items-center gap-3 mb-3">
								<GlobeIcon className="h-6 w-6 text-gray-700" />
								<h3 className="text-lg font-semibold text-gray-900">Gesture Status</h3>
							</div>
							<p className="text-sm text-gray-600 mb-6">Current gesture detection and feedback</p>
							<div className="flex-1 flex items-center justify-center">
								<div className="text-center">
									<div 
										className="text-6xl mb-3"
										ref={scope}
									>
										{emojiLabel === "None" ? "🤷" : 
										 emojiLabel === "Thumb_Up" ? "👍" : 
										 emojiLabel === "Thumb_Down" ? "👎" : 
										 emojiLabel === "Closed_Fist" ? "✊" : 
										 emojiLabel === "Open_Palm" ? "🖐️" : 
										 emojiLabel === "Pointing_Up" ? "😍" : 
										 emojiLabel === "Victory" ? "✌️" : 
										 emojiLabel === "OK" ? "👌" : 
										 emojiLabel === "ILoveYou" ? "🤟" : "🤷"}
									</div>
									<p className="text-sm font-medium text-gray-600">
										{emojiLabel === "None" 
											? "No gesture detected" 
											: emojiLabel === "Pointing_Up"
											? "We love you Andre 💕"
											: emojiLabel === "ILoveYou"
											? "I love you too! 💕"
											: `${emojiLabel} detected`
										}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Notice Board Card */}
					<div className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2">
						<div className="h-full bg-white rounded-xl border border-gray-200/50 shadow-lg p-6 flex flex-col">
							<div className="flex items-center gap-3 mb-4">
								<FileTextIcon className="h-6 w-6 text-gray-700" />
								<h3 className="text-lg font-semibold text-gray-900">Notice Board</h3>
							</div>
							<p className="text-sm text-gray-600">Upcoming events and announcements</p>
						</div>
					</div>

					{/* Log Card */}
					<div className="lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4">
						<div className="h-full bg-white rounded-xl border border-gray-200/50 shadow-lg p-6 flex flex-col">
							<div className="flex items-center gap-3 mb-4">
								<GlobeIcon className="h-6 w-6 text-gray-700" />
								<h3 className="text-lg font-semibold text-gray-900">Log</h3>
							</div>
							<p className="text-sm text-gray-600 mb-6">Avatar status and system information</p>
							<div className="flex-1 flex items-center justify-center">
								<div className="bg-gray-50 rounded-lg p-4 w-full">
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium text-gray-700">State:</span>
											<span className="text-gray-900">
												{isPersonDetected ? "active" : "idle"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-700">Mood:</span>
											<span className="text-gray-900">
												{gestureType === "Thumb_Up" ? "happy" : 
												 gestureType === "Thumb_Down" ? "sad" : 
												 gestureType === "Victory" ? "excited" : 
												 gestureType === "Closed_Fist" ? "angry" : 
												 gestureType === "Open_Palm" ? "calm" : 
												 gestureType === "Pointing_Up" ? "loving" : 
												 gestureType === "OK" ? "loving" : "bored"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-700">Animation:</span>
											<span className="text-gray-900">lookAround</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-700">Gesture:</span>
											<span className="text-gray-900">
												{emojiLabel === "None" ? "None" : emojiLabel}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}


export default App