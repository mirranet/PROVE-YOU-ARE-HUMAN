export function detectRaisedHands(results) {
    if (!results?.landmarks || results.landmarks.length === 0) {
        return [];
    }

    return results.landmarks.map((landmarks, index) => {
        const handedness =
            results.handednesses?.[index]?.[0]?.categoryName;

        const wrist = landmarks[0];
        const middleFingerTip = landmarks[12];

        const raised =
            middleFingerTip.y < wrist.y - 0.15;

        const fingers = countFingers(landmarks);

        return {
            hand: handedness,
            raised,
            fingers
        };
    });
}


/* =========================
   FINGER COUNT
========================= */

function countFingers(landmarks) {

    let count = 0;

    // Index
    if (landmarks[8].y < landmarks[6].y) {
        count++;
    }

    // Middle
    if (landmarks[12].y < landmarks[10].y) {
        count++;
    }

    // Ring
    if (landmarks[16].y < landmarks[14].y) {
        count++;
    }

    // Pinky
    if (landmarks[20].y < landmarks[18].y) {
        count++;
    }

    // Thumb
    const thumbTip = landmarks[4];
    const thumbJoint = landmarks[3];

    if (
        Math.abs(thumbTip.x - landmarks[0].x) >
        Math.abs(thumbJoint.x - landmarks[0].x)
    ) {
        count++;
    }

    return count;
}