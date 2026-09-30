export function detectFaceGestures(results) {

    if (
        !results ||
        !results.faceLandmarks ||
        results.faceLandmarks.length === 0
    ) {
        return null;
    }

    const landmarks = results.faceLandmarks[0];


    /* =========================
       EYE CENTERS
    ========================= */

    // Левый глаз
    const leftEyeOuter = landmarks[33];
    const leftEyeInner = landmarks[133];

    // Правый глаз
    const rightEyeInner = landmarks[362];
    const rightEyeOuter = landmarks[263];


    const leftEyeCenter = {
        x: (leftEyeOuter.x + leftEyeInner.x) / 2,
        y: (leftEyeOuter.y + leftEyeInner.y) / 2
    };

    const rightEyeCenter = {
        x: (rightEyeOuter.x + rightEyeInner.x) / 2,
        y: (rightEyeOuter.y + rightEyeInner.y) / 2
    };


    /* =========================
       NOSE
    ========================= */

    const nose = landmarks[1];


    const faceCenterX =
        (leftEyeCenter.x + rightEyeCenter.x) / 2;


    const noseOffset =
        nose.x - faceCenterX;


    /* =========================
       LOOK DIRECTION
    ========================= */

    let lookDirection = "CENTER";


    /*
        В координатах изображения:

        физически ВЛЕВО пользователя
        -> обычно движение вправо по изображению

        физически ВПРАВО пользователя
        -> движение влево по изображению
    */

    if (noseOffset > 0.035) {

        lookDirection = "LEFT";

    } else if (noseOffset < -0.035) {

        lookDirection = "RIGHT";
    }


    /* =========================
       MOUTH
    ========================= */

    const mouthTop = landmarks[13];
    const mouthBottom = landmarks[14];

    const mouthDistance =
        Math.abs(
            mouthBottom.y -
            mouthTop.y
        );

    const mouthOpen =
        mouthDistance > 0.035;


    /* =========================
       HEAD TILT
    ========================= */

    const eyeDx =
        rightEyeCenter.x -
        leftEyeCenter.x;

    const eyeDy =
        rightEyeCenter.y -
        leftEyeCenter.y;

    const angle =
        Math.atan2(
            eyeDy,
            eyeDx
        ) * 180 / Math.PI;


    let headTilt = "CENTER";


    if (angle > 8) {

        headTilt = "LEFT";

    } else if (angle < -8) {

        headTilt = "RIGHT";
    }


    return {

        lookDirection,

        headTilt,

        mouthOpen,

        mouthDistance,

        noseOffset,

        angle
    };
}