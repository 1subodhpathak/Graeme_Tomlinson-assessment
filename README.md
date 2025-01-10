# Graeme_Tomlinson-assessment

A Firebase Cloud Function that creates users in Firebase Authentication and stores their additional information in Firestore. This project includes a test interface for creating users and demonstrates proper security rules implementation.

## Features

- Create users in Firebase Authentication
- Store user profiles in Firestore
- Custom UID support (optional)
- Secure Firestore rules
- Test interface for user creation
- TypeScript implementation
- CORS support
- Error handling

## Prerequisites

- Node.js (v18.x)
- Python3
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Authentication and Firestore enabled

## Project Structure

```
├── functions/
│   ├── src/
│   │   └── index.ts          # Cloud Function implementation
│   ├── package.json          # Function dependencies
│   └── tsconfig.json         # TypeScript configuration
├── public/
│   ├── js/
│   │   ├── firebase-config.js        # Firebase configuration
│   │   └── firebase-config-example.js # Example configuration template
│   └── test.html            # Test interface
├── firestore.rules          # Firestore security rules
├── firebase.json            # Firebase configuration
└── README.md               # This file
```

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**

   ```bash
   cd functions
   npm install
   ```

3. **Configure Firebase**

   - Copy `public/js/firebase-config-example.js` to `public/js/firebase-config.js`
   - Update the configuration with your Firebase project details:
     ```javascript
     export const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       // ... other config values
     };
     ```

4. **Login to Firebase**

   ```bash
   firebase login
   ```

5. **Select your Firebase project**
   ```bash
   firebase use your-project-id
   ```

## Local Development

1. **Start the Firebase emulators**

   ```bash
   firebase emulators:start
   ```

   This will start:

   - Authentication emulator on port 9099
   - Functions emulator on port 5001
   - Firestore emulator on port 8081
   - Emulator UI interface

2. **Access the test interface**

```bash
cd public
python3 -m http.server 8000
```

- Open `http://localhost:8000/test.html` in your browser
- The test interface allows you to create users with all required fields

## Deployment

Deploy the project to Firebase:

```bash
firebase deploy
```

To deploy only specific components:

```bash
firebase deploy --only functions   # Deploy only functions
firebase deploy --only firestore:rules   # Deploy only Firestore rules
```

## Testing

1. **Using the Test Interface**

   - Navigate to the test interface (local: `http://localhost:8000/test.html` or deployed version)
   - Fill in the required fields:
     - Email
     - Password
     - Name
     - Gender
   - Optionally provide a custom UID
   - Submit the form to create a user

2. **API Endpoint**
   The function can be called directly via HTTP POST:
   ```bash
   curl -X POST https://[your-region]-[your-project-id].cloudfunctions.net/createUser \
   -H "Content-Type: application/json" \
   -d '{
     "email": "user@example.com",
     "password": "password123",
     "name": "Test User",
     "gender": "other",
     "uid": "optional-custom-uid"
   }'
   ```

## Security Rules

The Firestore security rules ensure that:

- Only authenticated users can read their own documents
- Users can only write to their own documents
- Sub-collections are denied by default

## Error Handling

The function handles various error cases:

- Invalid request methods
- Missing required fields
- Duplicate emails
- Invalid UIDs
- Server errors

## Response Format

### Success Response

```json
{
  "message": "User created successfully",
  "userId": "generated-or-custom-uid"
}
```

### Error Response

```json
{
  "error": {
    "message": "Error description",
    "status": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
