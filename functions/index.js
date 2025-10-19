/**
 * Cloud Function (Node.js) example for Storage onFinalize trigger.
 * - Generates a thumbnail (using sharp recommended) and uploads to public thumbnails path.
 * - Calls Vision SafeSearch to detect unsafe content and updates Firestore prompt doc status.
 *
 * NOTE: This file is a template. To deploy, put it in functions/ and configure Firebase Functions with proper billing and APIs.
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

exports.onPromptImageFinalize = functions.storage.object().onFinalize(async (object) => {
  try {
    const filePath = object.name; // e.g. prompts/{uid}/{filename}
    if (!filePath.startsWith('prompts/')) return null;
    const [result] = await client.safeSearchDetection(`gs://${object.bucket}/${filePath}`);
    const detections = result.safeSearchAnnotation;
    const adult = detections.adult;
    const violence = detections.violence;
    const racy = detections.racy;
    const risk = ['LIKELY','VERY_LIKELY'];
    let flagged = false;
    if (risk.includes(adult) || risk.includes(violence) || risk.includes(racy)) flagged = true;
    if (flagged) {
      await admin.firestore().collection('moderationQueue').add({
        filePath,
        bucket: object.bucket,
        flaggedAt: admin.firestore.FieldValue.serverTimestamp(),
        reason: {adult,violence,racy},
      });
    }
    return null;
  } catch (err) {
    console.error('Error in moderation function', err);
    return null;
  }
});
