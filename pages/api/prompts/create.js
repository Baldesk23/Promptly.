import admin from '../../../lib/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const { title, promptText, tags = [], category = 'General', aiModel = '' } = req.body || {};
    if (!title || !promptText) return res.status(400).json({ error: 'Missing fields' });

    const docRef = admin.firestore().collection('prompts').doc();
    const doc = {
      title: title.slice(0,200),
      promptText: promptText.slice(0,2000),
      tags: tags.slice(0,20),
      category,
      aiModel,
      ownerId: uid,
      public: true,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      likesCount: 0,
      copiesCount: 0,
      viewsCount: 0,
    };
    await docRef.set(doc);
    return res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
