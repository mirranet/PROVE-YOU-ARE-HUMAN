import {
    FilesetResolver,
    FaceLandmarker
} from "@mediapipe/tasks-vision";

let faceLandmarker = null;


export async function initializeFaceTracking() {

    console.log("Loading Face Landmarker...");

    const vision =
        await FilesetResolver.forVisionTasks(
            "/wasm"
        );


    faceLandmarker =
        await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",

                    delegate: "CPU"
                },

                runningMode: "VIDEO",

                numFaces: 1,

                outputFaceBlendshapes: true,

                outputFacialTransformationMatrixes: true
            }
        );


    console.log(
        "Face Landmarker initialized"
    );
}


export function detectFace(video) {

    if (!faceLandmarker) {
        return null;
    }


    return faceLandmarker.detectForVideo(
        video,
        performance.now()
    );
}