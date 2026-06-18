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
      databaseURL: "https://truecaller-clone-74794-default-rtdb.firebaseio.com/"
    });
    console.log("✓ Firebase Admin SDK linked successfully with Realtime DB!");
} else {
    console.log("⚠️ Warning: FIREBASE_PRIVATE_KEY is missing in Render Environment Variables!");
}

const db = admin.apps.length ? admin.database() : null;

// 🔍 SMART API: Search Number (Handles 346 Contacts & Country Codes)
app.post('/api/search', async (req, res) => {
    let { number } = req.body;
    if (!number) return res.json({ success: false, message: "Number toh dalo bhai!" });
    if (!db) return res.json({ success: false, message: "Backend active hai, par Firebase connected nahi hai!" });

    // Clean space and convert to string
    let searchNum = number.toString().trim();

    try {
        // Step 1: Root check (Agar data pure root par ya direct contacts par ho)
        const rootRef = db.ref('/');
        const rootSnapshot = await rootRef.once('value');
        
        if (rootSnapshot.exists()) {
            const rootData = rootSnapshot.val();
            
            // Agar data 'contacts' folder ke andar hai ya direct root par hai, dono check karega
            let targetData = rootData.contacts ? rootData.contacts : rootData;
            
            // Poore database keys (numbers) mein match dhoondo
            let foundKey = Object.keys(targetData).find(key => {
                let cleanKey = key.replace(/\D/g, ''); // Remove + or spaces from DB keys
                return cleanKey.includes(searchNum) || searchNum.includes(cleanKey);
            });

            if (foundKey) {
                let matchedRecord = targetData[foundKey];
                
                // Format name response (agar normal text hai ya object hai)
                let finalName = typeof matchedRecord === 'object' ? (matchedRecord.name || matchedRecord.Display_Name || "Saved Contact") : matchedRecord;
                let isSpam = typeof matchedRecord === 'object' ? (matchedRecord.isSpam === true || matchedRecord.isSpam === "true") : false;

                return res.json({
                    success: true,
                    found: true,
                    data: { name: finalName, isSpam: isSpam }
                });
            }
        }

        // Agar kahin nahi mila
        res.json({ success: true, found: false, message: "Yeh number database mein nahi mila." });

    } catch (error) {
        console.error("Database Error:", error);
        res.json({ success: false, message: "Database search error occurred." });
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
