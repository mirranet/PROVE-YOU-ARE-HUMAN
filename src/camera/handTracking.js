import {
    FilesetResolver,
    HandLandmarker,
    DrawingUtils
} from "@mediapipe/tasks-vision";

let handLandmarker = null;
let drawingUtils = null;

export async function initializeHandTracking(canvas) {
    console.log("Loading MediaPipe WASM...");

    const vision = await FilesetResolver.forVisionTasks(
        "/wasm"
    );

    console.log("Creating HandLandmarker...");

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "CPU"
        },

        runningMode: "VIDEO",

        numHands: 2
    });

    drawingUtils = new DrawingUtils(
        canvas.getContext("2d")
    );

    console.log("Hand tracking initialized");
}

export function detectHands(video, canvas) {
    if (!handLandmarker) {
        return null;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const results = handLandmarker.detectForVideo(
        video,
        performance.now()
    );

    if (results.landmarks) {
        for (const landmarks of results.landmarks) {

            drawingUtils.drawConnectors(
                landmarks,
                HandLandmarker.HAND_CONNECTIONS,
                {
                    color: "#1677ff",
                    lineWidth: 3
                }
            );

            drawingUtils.drawLandmarks(
                landmarks,
                {
                    color: "#3d9bff",
                    lineWidth: 1,
                    radius: 4
                }
            );
        }
    }

    return results;
}