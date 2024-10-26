// import * as admin from 'firebase-admin';
// import { ServiceAccount } from 'firebase-admin';

// const serviceAccount = require('path to service account key.json') // make sure to add this key path

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as ServiceAccount)
// });

// export const auth = admin.auth();

// export const verifyFirebaseToken = async (req: any, res: any, next: any) => {
//     const token = req.headers.authorization?.split('Bearer ')[1];

//     if (!token) {
//         return res.status(401).json({ error: 'No Token Provided' });
//     }

//     try {
//         const decodedToken = await auth.verifyIdToken(token);
//         req.user = decodedToken;
//         next();
//     } catch (error) {
//         console.error('Error veryifying', error);
//         res.status(403).json({ error: 'Invalid Token'});
//     }
// };