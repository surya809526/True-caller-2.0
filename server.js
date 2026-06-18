const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// 🔑 SAFE FIREBASE INITIALIZATION WITH YOUR EXACT URL
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID || "truecaller-clone-74794",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL
};

if (process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://truecaller-clone-74794-default-rtdb.firebaseio.com/" // Tumhara exact database URL fix kar diya hai
    });
    console.log("✓ Firebase Admin SDK linked successfully with Realtime DB!");
} else {
    console.log("⚠️ Warning: FIREBASE_PRIVATE_KEY is missing in Render Environment Variables!");
}

const db = admin.apps.length ? admin.database() : null;

// 🔍 API: Search Number
app.post('/api/search', async (req, res) => {
    const { number } = req.body;
    if (!number) return res.json({ success: false, message: "Number toh dalo bhai!" });
    if (!db) return res.json({ success: false, message: "Backend active hai, par Firebase connected nahi hai!" });

    try {
        const ref = db.ref(`contacts/${number}`);
        const snapshot = await ref.once('value');
        
        if (snapshot.exists()) {
            res.json({ success: true, found: true, data: snapshot.val() });
        } else {
            res.json({ success: true, found: false, message: "Yeh number database mein nahi mila." });
        }
    } catch (error) {
        res.json({ success: false, message: "Database error occurred." });
    }
});

// 📥 API: Add or Report Number
app.post('/api/report', async (req, res) => {
    const { number, name, isSpam } = req.body;
    if (!number || !name) return res.json({ success: false, message: "Name aur Number dono zaroori hain!" });
    if (!db) return res.json({ success: false, message: "Backend active hai, par Firebase connected nahi hai!" });

    try {
        const ref = db.ref(`contacts/${number}`);
        await ref.set({
            name: name,
            number: number,
            isSpam: isSpam || false,
            reportedAt: new Date().toISOString()
        });
        res.json({ success: true, message: "Number successfully register ho gaya bhai!" });
    } catch (error) {
        res.json({ success: false, message: "Save karne mein dikkat aayi." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Truecaller Clone Backend active on port ${PORT}`);
});
