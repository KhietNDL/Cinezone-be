const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('ERROR: Firebase service account key file not found at:', serviceAccountPath);
  throw new Error('Firebase service account key file not found');
}

if (!process.env.FIREBASE_STORAGE_BUCKET) {
  console.error('ERROR: FIREBASE_STORAGE_BUCKET environment variable is not set');
  throw new Error('FIREBASE_STORAGE_BUCKET environment variable is not set');
}

try {
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  console.log(`Firebase initialized successfully with bucket: ${process.env.FIREBASE_STORAGE_BUCKET}`);
  
  const bucket = admin.storage().bucket();
  
  bucket.exists()
    .then(data => {
      const exists = data[0];
      if (exists) {
        console.log('Successfully connected to Firebase Storage bucket');
      } else {
        console.error('Firebase Storage bucket does not exist or access denied');
      }
    })
    .catch(error => {
      console.error('Failed to check Firebase Storage bucket:', error);
    });

  module.exports = bucket;
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  module.exports = {
    file: () => ({
      createWriteStream: () => { 
        throw new Error('Firebase not initialized properly'); 
      },
      getSignedUrl: async () => ['https://placeholder-image-url.com/error'],
      delete: async () => { throw new Error('Firebase not initialized properly'); }
    }),
    upload: () => { throw new Error('Firebase not initialized properly'); }
  };
}