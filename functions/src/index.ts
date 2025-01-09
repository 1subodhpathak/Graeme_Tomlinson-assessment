import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Define interfaces for type safety
interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  gender: string;
}

interface ErrorResponse {
  error: {
    message: string;
    status?: string;
    details?: string;
  };
}

interface SuccessResponse {
  message: string;
  userId: string;
}

// Create user function with proper typing
export const createUser = functions.https.onRequest(async (req, res) => {
  const corsHandler = cors({ origin: true });

  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        const response: ErrorResponse = {
          error: {
            message: 'Only POST requests are allowed',
            status: 'INVALID_METHOD'
          }
        };
        return res.status(405).json(response);
      }

      const { email, password, name, gender } = req.body as CreateUserRequest;

      if (!email || !password || !name || !gender) {
        const response: ErrorResponse = {
          error: {
            message: 'Invalid request payload. Required fields: email, password, name, gender',
            status: 'INVALID_ARGUMENT'
          }
        };
        return res.status(400).json(response);
      }

      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name
      });

      // Create the timestamp directly as a Date object
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        name,
        email,
        gender,
        createdAt: new Date()
      });

      const response: SuccessResponse = {
        message: 'User created successfully',
        userId: userRecord.uid
      };
      return res.status(201).json(response);

    } catch (error: any) {
      console.error('Error creating user:', error);
      const response: ErrorResponse = {
        error: {
          message: 'Internal server error',
          details: error.message
        }
      };
      return res.status(500).json(response);
    }
  });
});